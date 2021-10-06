# Demeter CAPP

This is the source code for the Demeter CAPP PWA.

The Common Agricultural Policy App (CAPP) includes parcel boundaries from farmers and a request feed with tasks a farmer has to fulfill. The app allows the farmer to respond to a request and its tasks and e.g. take a geotagged photo. This photo can then be retrieved from a paying agency after the task is completed. Since the photo's geo-coordinates are derived from the smartphone and transferred directly to the data storage, the farmer has minimal option to manipulate them. Each parcel can be selected by the farmer and all of its attributes are visualised. When a parcel is selected the farmer can see photos including their geo-coordinates.

The CAPP prototype includes the following features:
- A progressive web-app allowing an OS-independent functionality through a web browser
- User accounts with authentication and authorization
- Integration of geographic field data and display of related attributes
- Integration of static background layers (e.g. satellite images)
- Geo-tagged photocapture, link to individual parcels and upload to a defined repository.

The accuracy of the geo-coordinates will depend on the smartphone's GPS unit and GPS coverage at the time of photo acquisition

![CAPP Screenshots](/Screenshots.png)

> Here you can find a short video introduction: [https://demeter.terranea.de](https://demeter.terranea.de)

## Demeter Project
This application has been developed within the DEMETER project. The H2020 DEMETER project is a large-scale deployment of farmer-driven, interoperable smart farming-IoT (Internet of Things) based platforms, delivered through a series of 20 pilots across 18 countries (15 EU countries). Involving 60 partners, DEMETER adopts a multi-actor approach across the value chain (demand and supply), with 25 deployment sites, 6,000 farmers and over 38,000 devices and sensors being deployed.

[https://h2020-demeter.eu/](https://h2020-demeter.eu/)

![Demeter, Horizon 2020](/Demeter-Horizon.png)

## Technologies and Data
The app was created as a progressive web app and uses the following open source technologies:

Client/App:

- Javascript Framework: [SvelteKit](https://kit.svelte.dev/)
- Map rendering: [MapLibre](https://maplibre.org/) and [MapTiler](https://www.maptiler.com/)

Backend:

- API Endpoints: [Hasura](https://hasura.io/)
- Database: [Postgresql](https://www.postgresql.org/)
- Storage: [Minio](https://min.io/)

## Developing

Once you've downloaded the repository and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
