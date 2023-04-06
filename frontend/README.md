## TODO

- move zod schemas to Z... prefix
-   !!!: Sanitizes markdown parsers, otherwise people can inject code into your backend when u expose an endpoint.
-   Dark mode scheme: https://huemint.com/website-monochrome/#palette=20282f-f0f1f5
-   <meta name="theme-color" content="#4285f4" />
-   get a slick primary color
-   Add cron to watch system index / timeframes & recalculate / cleanup
    -   e.g.
        -   ! remove empty frames
        -   ! rebuild list -> get all frames, order by time and update next/prev frame link
        -   move events without time frame into manual cleanup list
-   Add auto complete to filters

## cool integration possibilities

-   Form builder - https://deta.space/discovery/@deta/formate
-   Poll builder - https://deta.space/discovery/@aarushth/pollster
-   Uptime - https://deta.space/discovery/@xarzoa/upty

# Long Term Goals

-   Notifications like LogSnag
-   Webapp on phones using new APIS (Support IOS through new api)
-   Accept ingest from webhooks
-   Webhook -> On Event

# Icons

- General
    - Plus / Add
    - Alt Add
    - Copy
    - Delete / Trash
    - Section open & closed
    - Feed
    - Metrics
    - Monitor
    - Projects
    - Settings
    - Docs
    - Sun / Moon (Theme switch)
- Header
    - Menu Burger
    - Filter
    - Card style
- Projects page
    - Key
    - (Hashtag) / channel
- Event page
    - Link
