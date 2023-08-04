## Random
- https://github.com/traceo-dev/traceo


## TODO
### Top launch prio
- [ ] + Filter cached
- [x] % Push notifications.. remove for first release
- [x] fix tour / disable on mobile, show msg
- [ ] Export feature -> usful for my analytics test
- [ ] Fix zod validation error on event create --> better msg

- [ ] Docs update
- [ ] Clean App icon & graphcis
- [ ] Launch web page (use pingback for analytics)

### Normal Prio
- [ ] Animated icon. New events stacking up.. fade out bottom ones.. / "Pinging" animation

- move zod schemas to Z... prefix
-   !: Sanitizes markdown parsers, otherwise people can inject code into your backend when u expose an endpoint.
-   Dark mode scheme: https://huemint.com/website-monochrome/#palette=20282f-f0f1f5
[x]   get a slick primary color
-   Add cron to watch system index / timeframes & recalculate / cleanup
    -   e.g.
        -   ! remove empty frames
        -   ! rebuild list -> get all frames, order by time and update next/prev frame link
        -   move events without time frame into manual cleanup list
-   Add auto complete to filters
- use worker to fetch & filter events in list

## cool integration possibilities

-   Form builder - https://deta.space/discovery/@deta/formate
-   Poll builder - https://deta.space/discovery/@aarushth/pollster
-   Uptime - https://deta.space/discovery/@xarzoa/upty

# Long Term Goals

-   Webapp on phones using new APIS (Support IOS through new api)
-   Accept ingest from webhooks
-   Webhook -> On Event

# Query fuzz

= != < > <= >=

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


## Cool little future integrations / thoughts
- https://deta.space/discovery/@berrysauce/altar
  - Project icons -> make them more distinglishable
- Add a “recipes” section. Have preset recipes which can be “added” to simplify common setup.
    - e.g. “Web statistics” recipe generates project for website, adds metrics dashboard to view statistics.