
# 1. Introduction

## 1.1 Overview

**OneKey** is a framework of standards designed to provide users with a consistent, transparent and low-friction experience when accessing content across the open web, especially when that content is funded through marketing.
On marketers' and publishers’ side, the framework enables responsible addressable marketing without relying on any single central actor.

The framework enables setting up a random Identifier (ID) that is transparent to the User, and that is linked to user marketing preferences which can be changed at any moment. This ID and marketing preferences are available to all actors who are adhering to the standards.

The framework standardizes:
- Technical protocols for participants to read, edit and propagate the IDs and preferences, and to produce an Audit Log that the user may access for each piece of marketing content that he sees.
- A base set of purposes the user may consent to, defining personalized marketing (which is based on their behavior and interests), and standard marketing (which isn't).
- Consistent UX and wording requirements to explain those base purposes to the users.
- Model terms that any participants should include in their pairwise contractual agreements, to hold each other accountable to the framework's standards and underlying principles.

The framework is being designed by a community of engineers, lawyers and UX designers within Prebid's Addressability PMC, and as a consequence has been often referred to as **Prebid Addressability Framework** (**PAF**). In particular, the open source software that can be used to facilitate adhesion to the framework uses `PAF` or `paf` in the naming of most related objects.

## 1.2 Principles

OneKey is built on four key principles:

-   **Secure and privacy friendly**: IDs automatically reset without user interaction every 6 months. Users can reset their ID at any time and on any site which adheres to the framework. This ensures data minimization and is compliant with global privacy regulations.
    
-   **User transparency and control**: Users can easily view and manage and change their preferences on any site that uses this data. Users can also inquire on who received their data to show a specific ad, through available Audit Logs.
    
-   **Open-source and interoperable**: The framework is open-source and doesn’t provide any self-preferencing benefit to existing marketplace providers.
    
-   **Independently governed**: Adhering actors incorporate the Model Terms into their general terms and ensure their use of data is available in an accountable Audit Log viewable by all actors.
    

These core principles keep user preferences at the center, while ensuring the AdTech industry implements a framework that allows all actors to continue to achieve their business goals seamlessly.


## 1.3 Benefits

**User Benefits**

-   Simpler navigation across the open web with less pop-ups
    
-   Ability to surf incognito (private browsing)
    
-   Free access to logs for auditing purposes
    
-   Continued access to a wider diversity of open web content and services
    

**Publisher Benefits**

-   Continued ability to choose which partners they work with to operate and grow their business
    
-   Improved monetization of their existing ad-funded pages
    
-   Better insight into which organizations are driving value thanks to generated Audit Logs
    

**Marketer Benefits**

-   Improved analytics and valuation across the open web
    
-   Better insight to investigate potential publisher fraud, thanks to Audit Logs

    

# 2. Organisations of OneKey’s GitHub repository:

This repo is for documenting technical specifications. It contains:

-   The MVP technical specification folder: [MVP Specs](/mvp-spec)
    
-   An integration guide for all actors: [OneKey-Integration-Guide.md](/Integration-guides/OneKey-Integration-Guide.md)
    
-   The actual open-source code for MVP implementation is hosted in another GitHub repo that is here: [OneKey-implementation](https://github.com/OneKey-Network/OneKey-implementation)
    
-   A demo website with the MVP implementation is currently available for all to see here: [https://www.pafdemopublisher.com/](https://www.pafdemopublisher.com/)

# 3. Components and roles involved in the OneKey framework

![OneKey Components and Roles Diagram](/mvp-spec/assets/PAF%20roles.png)


| **Component<br>**                     	| **Description<br>**                                                                                 	| **Role / Functions<br>**                                                                                                                                                                                                                                                         	| **Example(s)<br>**                                                                                   	|
|---------------------------------------	|-----------------------------------------------------------------------------------------------------	|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|------------------------------------------------------------------------------------------------------	|
| **Website**                          	| A Publisher or Marketer Web Property.<br>                                                           	| <ul><li>Offers the standard choices to its users through a CMP component</il><li>Reads IDs and Preferences from an Operator<br>Generates ad or content using the IDs and Preferences through a digital supply chain</il><li>Provides the Audit Log to the user for such ads or content</li></ul> 	| **A Publisher:** <br>www.my-news-site.com<br>**A Marketer:**<br>www.brand-name.com                         	|
| **Operator**                      	| A node participating to the decentralized management of the IDs and Preferences.                    	| <ul><li>Synchronizes IDs and Preferences with other Operators</il><li>Enables client Websites to read and set the IDs and Preferences</li></ul>                                                                                                                                                 	| **An AdTech Partner:**<br>crto.onekey.network<br>iponweb.onekey.network<br>**A CMP Partner:**<br>(see below) 	|
| **Client Node**                   	| Software component handling all signing operations for a Website.                                   	| <ul><li>Secures authentication between the Website and its Operator</il><li>Authenticates the transactions initiated by a Website</li></ul>                                                                                                                                                         	| **An Operator Partner:**<br>(see above)<br>**A CMP Partner:**<br>(see below)                                  	|
| **Consent Management Platform (CMP)** 	| Software Component used by a Website to present notice & choice for users. <br>                     	| <ul><li>Presents the standard choices (edit Preferences, reset IDs and/or stop using OneKey) to the user in addition to any site-specific choices (e.g. direct payment)</li></ul>                                                                                                                               	| **A CMP Partner:**<br>SourcePoint<br>OneTrust …<br>**or a self-operated solution**                           	|
| **SSP, Ad Exchanges, DSPs**           	| Partners that are involved in the digital advertising or digital content supply chain of a Website. 	| <ul><li>Transmits the IDs and Preferences to their own partners<br>Generates ads and content using the IDs and Preferences</il><li>Appends signatures to the Audit Log</li></ul>                                                                                                                        	| Iponweb<br>OpenX<br>Criteo…                                                                          	|

### Network DNS zone

In the current design, Operators have the constraint to run services on subdomains of a common domain name (e.g. `onekey.network`). This is because the synchronization of IDs and Preferences across Operators relies on the cookie jar of the common domain.

To achieve this, each Operator is responsible for inserting the right information for the subdomain that they use in the network’s DNS zone.

For example, for an *Operator A* of the `onekey.network` network, the `operator_a.onekey.network` subdomain should be mapped to the DNS server of *Operator A* through a NS/SOA records.


## 4. The Role of the Model Terms

The framework includes a text document containing a set of legal clauses that any pair of organizations may include in the contract that binds them. Those are called “the Model Terms”.

For example:

-   an organization operating a Website may include the Model Terms in its contract with an organization that operates their CMP.
    
-   similarly, it may be included in the contract between a Website and its Operator.
    
-   between a Website and their SSP.
    
-   between a SSP and an Ad Exchange, or between a SSP and a DSP etc.
    

The benefit of using the Model Terms is that it reinforces the compliance of both organizations to Data Protection regulation, and clarifies their respective liabilities in case of harm resulting from misprocessing of the user data.

It’s notable that the Model Terms requires that the IDs and Preferences that are sent from one party to another may only be further transferred to third parties with whom a contract including the Model Terms has also been signed.

When an organization decide to use the Model Terms in its contract, it guarantees that the IDs and Preferences that they process and transfer can only be legally processed by other organization that are also bound to the same terms.

The goal of the technical part of the framework, which is further described in this documentation, is to facilitate the conformity of the organization operations to those terms.
