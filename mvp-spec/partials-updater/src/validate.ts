import Ajv, { ErrorObject } from "ajv";
import { config } from "process";
import { listJsonPartials, listJsonSchemas, loadJsonSchema, loadPartial } from "./files";

interface SchemaConfiguration {
    jsonPartial: string,
    schemaIdentifier: string
}

interface Validation {
    config: SchemaConfiguration,
    valid: boolean,
    errors: ErrorObject[] | Error[]
}

const staticConfigurations : SchemaConfiguration[] = [
    { 
        jsonPartial: "transmission-request.json", 
        schemaIdentifier: "transmission-request.json"
    },
    { 
        jsonPartial: "transmission-response-with-children.json", 
        schemaIdentifier: "transmission-response.json"
    },
    { 
        jsonPartial: "audit-log.json", 
        schemaIdentifier: "audit-log.json"
    },
    { 
        jsonPartial: "open-rtb-request-with-transmission.json",
        schemaIdentifier: "open-rtb-bid-request.json"
    },
    { 
        jsonPartial: "open-rtb-response-with-transmission.json",
        schemaIdentifier: "open-rtb-bid-response.json"
    },
    { 
        jsonPartial: "seed.json", 
        schemaIdentifier: "seed.json"
    },
]

const configurations : Promise<SchemaConfiguration[]> = buildAdAuctionExampleConfiguration().then((v) => {
    return v.concat(staticConfigurations);
});

export async function validateJsonFormats() {
    const jsonPartials = await listJsonPartials()
    for (const partial of jsonPartials) {
        const jsonDocument = await loadPartial(partial)
        try {
            JSON.parse(jsonDocument.content)    
        } catch (error) {
            console.error(`Invalid JSON format for "${partial}": ${error}`)
        }
    }
}

export async function validateJsonSchemas() {
    const ajv = await buildAjv()
    const configs = await configurations;
    const validations = await Promise.all(configs.map(c => validate(ajv, c)))
    const unvalids = validations.filter(v => !v.valid)
    const logs = unvalids.map(u => `Unvalid json "${u.config.jsonPartial}" for schema "${u.config.schemaIdentifier}": ${JSON.stringify(u.errors)}`)
    for (const log of logs) {
        console.error(log)
    }
    if (logs.length == 0) {
        console.log(`Partials validated against schemas:\n- ${configs.map(c => c.jsonPartial).join('\n- ')}.`)
    }
}

async function validate(ajv: Ajv, config: SchemaConfiguration): Promise<Validation> {
    const ajvValidate = ajv.getSchema(config.schemaIdentifier)
    const jsonDocument = await loadPartial(config.jsonPartial)
    try {
        const json = JSON.parse(jsonDocument.content)
        const valid = ajvValidate(json) as boolean
        return {
            config,
            valid,
            errors: valid ? [] : ajvValidate.errors
        }    
    } catch (error) {
        return {
            config,
            valid: false,
            errors: [ error ]
        }
    }
}

async function buildAjv(): Promise<Ajv> {
    const schemaFiles = await listJsonSchemas()
    const docSchemas = await Promise.all(schemaFiles.map(loadJsonSchema))
    const schemas = docSchemas.map(d => JSON.parse(d.content))

    // Ugly patch to make it works with the existing schema
    // used for class generation in the demo project. 
    // To be reworked iteratively.
    for (const schema of schemas) {
        if (schema["$id"] !== undefined && !schema["$id"].endsWith(".json")) {
            schema["$id"] = `${schema["$id"]}.json`
        }
        delete schema["$schema"]
        if (schema["format"] === "hostname" || schema["format"] === "GUID") {
            delete schema["format"]
        }
    }
    
    const ajv =  new Ajv({ strict: false, schemas })
    return ajv
}

async function buildAdAuctionExampleConfiguration(): Promise<SchemaConfiguration[]> {
    const jsonPartials = await listJsonPartials();
    const examplePartials = jsonPartials.filter(x => x.startsWith('ad-auction-example-'));
    const configurations = examplePartials.flatMap(x => {
        const schema = getAdAuctionExampleSchema(x);
        if (schema === undefined) {
            return undefined;
        }
        return {
            jsonPartial: x,
            schemaIdentifier: schema
        };
    });
    return configurations;
}

function getAdAuctionExampleSchema(filename: string): string | undefined {
    if (filename.includes('request')) {
        return 'open-rtb-bid-request.json';
    }
    if (filename.includes('response')) {
        return 'open-rtb-bid-response.json';
    }
    if (filename.includes('audit-log')) {
        return 'audit-log.json';
    }
    return undefined;
}
