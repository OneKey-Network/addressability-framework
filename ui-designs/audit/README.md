![OneKey Logo](images/onekey-logo.svg)

# Audit Log UI design

Hello! :wave:

You are reading about a user interface design for a modern advertising funded open web.

The audit log shows users the organizations that used data to deliver the
content and services they interact with. The UI is both understandable and easy to use, whilst providing detailed information for those users that want it. The UI also supports providing audit log level information to agents that can analyse the data on behalf of users.

The Figma file is available [here](onekey-audit-log-demo.fig).

# Features

## Advert audit

On the first screen, the user receives a summary of the audit results. There are three possible results:

-   Everything is OK
-   There is an irregularity (error, missing data, or other) in the transactions
    responsible for the ad display.
-   The user's preferences may not have been respected.

<figure>
    <img src="images/advert-audit-trusted.png" alt="Advert audit trusted state">
    <figcaption><i>Advert audit trusted state</i></figcaption>
</figure>
<br>
<figure>
    <img src="images/advert-audit-suspicious.png" alt="Advert audit suspicious state">
    <figcaption><i>Advert audit suspicious state</i></figcaption>
</figure>
<br>
<figure>
    <img src="images/advert-audit-violation.png" alt="Advert audit violation detected state">
    <figcaption><i>Advert audit violation detected state</i></figcaption>
</figure>
<br>

## User data

They can also see their marketing preference and if they have generated a
synchronization between devices in the CMP settings, the code for this will be shown.

<figure>
    <img src="images/your-data-id.png" alt="User data: ID">
    <figcaption><i>User's ID</i></figcaption>
</figure>
<br>
<figure>
    <img src="images/your-data-marketing.png" alt="User data: Marketing preference">
    <figcaption><i>User's marketing preference</i></figcaption>
</figure>
<br>
<figure>
    <img src="images/your-data-sync.png" alt="User data: Sync ID">
    <figcaption><i>User's sync ID</i></figcaption>
</figure>
<br>

## Participating companies

The user can see which companies used data involved in the display of the ad they saw. The companies are listed in different tabs to aid the user in identifying the role they played in serving the advert. The company's terms for data use, and contact details are shown enabling the user to directly communicate with these companies should they need to.

<figure>
    <img src="images/participants.png" alt="Participants: Winner companies">
    <figcaption><i>Winner companies</i></figcaption>
</figure>
<br>
<figure>
    <img src="images/participants-suspicious.png" alt="Participants: Suspicious or violation">
    <figcaption><i>Violation or suspicious transactions</i></figcaption>
</figure>
<br>

## Download

Users can download the content of the audit, which they can use to contact the authorities if they believe their rights have been violated.

<figure>
    <img src="images/download.png" alt="Download data">
    <figcaption><i>Download data</i></figcaption>
</figure>
<br>