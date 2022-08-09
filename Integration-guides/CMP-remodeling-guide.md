# Remodeling the Consent UI as a CMP

As a CMP, OneKey provides a lot of flexibility on when and how to address the user.

In addition, the CMP is free to provide any other related features which aren't standardized in OneKey.

Therefore, the CMP’s main task is to adapt its specifications to integrate the OneKey features. This guide can only instruct on:

-   What are the mandatory OneKey features?

-   How they should be presented and implemented (including recommendations for common use cases)?


### Retrieving and Refreshing Id and Preferences

The CMP must call `refreshIdsAndPreferences` on every page view, though it will not result in refresh every time. It will however triggers a new refresh of the Id and Preferences if the last refresh was done more than 48 hours ago.

On browsers that support 3rd party cookies, refreshing has no impact on the user experience so it may happen more frequently.

On browsers that block 3rd party cookies, a refresh triggers a boomerang full page redirect to and back from the Operator. For this to work, `refreshIdsAndPreferences` must be called at the very top of the <head> section.

This can be done as follows:

    <script
      src="https://my-cdn.example-website.com/assets/onekey.js"
      onload="PAF.refreshIdsAndPreferences({
        proxyHostName: 'paf.example-website.com',
        triggerRedirectIfNeeded: true
      });"
    ></script>

It’s possible to delay the retrieval of the id and preferences on browsers that block 3rd party cookies by setting `triggerRedirectIfNeeded: false`. In that case, the id and preferences will not be refreshed on such browsers and the method will return `PafStatus.REDIRECT_NEEDED`. This indicates the method must be called again with `triggerRedirectIfNeeded: true`.

### Change notifications

The CMP must display a notification to participating users:

-   The first time Id and Preferences are retrieved on the website

-   Whenever the Id or Preferences have changed since the last refresh


The notification wording depends on the user preferences.

If the user preference is for personalized marketing:

> You chose to see relevant ads on [website]
> 
> Update your marketing preferences at any time.
If the user preference is for standard marketing:

> You chose to see standard ads on [website]
> 
> Switch to personalized marketing at any time to make your ads more relevant.
The underlined words must be a link to open the CMP dialog for the user to edit their settings.

### Initial User Prompt

#### Initial id & preferences retrieval

Before prompting the user for the standard preferences, the CMP MUST check whether the user has already defined them. See [Retrieving and refreshing id and preferences](#retrieving-and-refreshing-id-and-preferences) for how to do this.

#### Prompting the user

If the initial retrieval reveals that the user doesn’t have id and preferences (`PafStatus.NOT_PARTICIPATING`), then no standard id and preferences will be available until the user is prompted with the OneKey choices and makes a proactive choice.

If the user already participates (`PafStatus.PARTICIPATING`), then the CMP MUST NOT directly prompt them to make a new choice (though offering an option to change their preferences or ask for additional information, such as an email or direct payment, is fine).

##### Get a new id

When prompting the user, the CMP can request a preliminary id from the Operator right away. However, this id will not be persisted until the CMP has collected the user’s choice and sent it with the id back to the Operator.

    var identifiers = await PAF.getNewId({
        proxyHostName: 'paf.example-website.com'
    });

##### Information to the user

When prompting the user, there is mandatory information that must be provided to the user.

Some of it should be directly on the prompt:

> **Manage your marketing preferences**
> 
> Enjoy smoother navigation without annoying pop-ups. OneKey personalizes your experience without directly identifying you. Opt-out or make changes at anytime.
Some of it must be accessible from the prompt:

> **Learn more about [ONEKEY_logo]**
> 
> We believe you should have transparency and control over how, where, and why your data is used.
> 
> We partnered with OneKey, a non-profit technology, to manage your marketing preferences when accessing [website] . OneKey relies on digital IDs to understand your activity and sends your preferences to our partner websites in order to customize the ads you see. IDs like these are an essential part of how [website]'s website operates and provides you with a more relevant experience.
> 
> You may change your preferences at any time. Your consent will automatically expire 2 years after you provide it. You have the right to be forgotten, which you can exercise at any time, and on any OneKey partner website simply by resetting your ID. You can also get a temporary ID by using the incognito/private browsing function of your browser.
> 
> If you choose not to participate, you will still see ads unrelated to your browsing activity.
> 
> You can learn more and manage your choices at any time by going to "Privacy settings" at the bottom of any page. See our [Privacy Policy] and [Privacy Notice].
##### Presenting the standard choices

3 choices must be offered to the user and each should require the same number of user actions

###### Personalized Marketing

> **Turn on personalized marketing**
> 
> See more relevant content and ads.
If the user makes this choice, the CMP must then ask the Operator to store `use_browsing_for_personalization: true` along with the new id.

    PAF.updateIdsAndPreferences('paf.example-website.com', true, identifiers);

###### Standard Marketing

> **Turn on standard marketing**
> 
> See generic content and ads.
If the user makes this choice, the CMP must then ask the Operator to store `use_browsing_for_personalization: false` along with the new id.

    PAF.updateIdsAndPreferences('paf.example-website.com', false, identifiers);

###### The option not to participate

The 2 first need to be displayed similarly and with equal prominence.

This last option can simply be a “close button”, or be the option that results from a “refuse all” button.

##### Change notification

If the user selected one of the options to participate, the CMP must confirm by displaying the change notification (see [Change Notifications](#change-notifications) above)

### Editing Preferences

On any page, a button or a link with the ONEKEY logo must be available for the user to edit their preferences.

The same options (with the same wording) must be made available to the user as during the initial user prompt, including the option to stop participating.

In addition, the id, shortened to the first 8 characters (i.e. until the first '-'), must be displayed for the user:

    var shortId = PAF.getIdsAndPreferences().identifiers[0].split('-')[0];

The user must have the ability to reset the id either by clicking it or through a dedicated button.

The CMP can then use `getNewId` to get a new one, as for the initial prompt.

The new id and preferences can then be stored using `updateIdsAndPreferences`.

The CMP must also notify the user when the change is made (see  [Change Notifications](#change-notifications) above).

If the user chose to stop participating, the CMP must delete the ids and preferences:

    PAF.deleteIdsAndPreferences('paf.example-website.com');

To be confirmed: On April 29th 2022 the method to delete ids and preferences is not finalized yet.

In this case, no change notification is required.

### Viewing the Audit Log for an Ad

The CMP and the Website must agree on a space next to each ad slot to display a button with the ONEKEY logo.

When the user clicks that button, the CMP must open a dialog that displays the audit log for the ad being displayed.

To get the audit log data structure for an ad in a specific ad slot (e.g. “div-1”), the CMP must call:

    var auditLog = PAF.getAuditLogByDivId("div-1");

To display the auditLog, the CMP can use the included widget:

    PAFUI.showAuditLog(auditLog);

To be confirmed: On April 29th 2022 the method to display the audit log viewer widget is not finalized yet.

Alternatively, the CMP can impact its own viewer widget.

Missing information: Guideline and requirements for implementing a viewer widget should be provided in a separate document.

### TCF Interoperability

It’s possible for the CMP to take advantage of the standard OneKey preferences' interoperability with TCF purposes.

The general idea is that the CMP should generate a TCF string including the TCF purposes that match the expressed standard preference of the user.

The CMP may offer the possibility for the user to further customize their selection of TCF purposes.

In this case,

-   if the user turns off TCF purposes from the 'Included in Personalized Marketing' list in the table below, then the CMP must switch the OneKey user preferences to “Standard Marketing”.

-   if the user turns off TCF purposes from either 'Included in Standard Marketing' or 'Legimate interest, can’t be turned off', then the CMP must stop the participation of the user

-   if the user selected “Standard Marketing”, but then turns on all 'Included in Personalized Marketing' TCF purposes, then the CMP may switch the OneKey user preferences to “Personalized Marketing”

-   if the user selected “Standard Marketing”, but then turns on some but not all 'Included in Personalized Marketing'  TCF purposes, then the CMP must highlight to the user that this extra selection of TCF purposes will only apply on the current website, and not across all websites compatible with OneKey.


#### Mapping between OneKey standard preferences and TCF purposes


| **TCF Purpose<br>**                                 	| **Mapping in OneKey standard preferences<br>**                                   	|
|-----------------------------------------------------	|----------------------------------------------------------------------	|
| Create a personalized ads profile                   	| Included in Personalized Marketing                                   	|
| Select personalized ads                             	| Included in Personalized Marketing                                   	|
| Create a personalized content profile               	| Included in Personalized Marketing                                   	|
| Select personalized content                         	| Included in Personalized Marketing                                   	|
| Select basic ads                                    	| Included in Personalized Marketing<br>Included in Standard Marketing 	|
| Measure ad performance                              	| Included in Personalized Marketing<br>Included in Standard Marketing 	|
| Measure content performance                         	| Included in Personalized Marketing<br>Included in Standard Marketing 	|
| Apply market research to generate audience insights 	| Included in Personalized Marketing<br>Included in Standard Marketing 	|
| Develop and improve products                        	| Included in Personalized Marketing<br>Included in Standard Marketing 	|
| Store and/or access information on a device         	| Included in Personalized Marketing<br>Included in Standard Marketing 	|
| Ensure security, prevent fraud, and debug           	| Legimate interest, can’t be turned off                               	|
| Technically deliver ads or content                  	| Legimate interest, can’t be turned off                               	|

-   UI changes

Example will be provided soon
-   UI wording changes

Example will be provided soon
