<p align="center">
  <img src="https://content.ad.nexus/website/images/analytics-logo.png" alt="Analytics Logo" width="100">
</p>

<h1 align="center">Analytics</h1>

<p align="center">
  <i>Analytics is a simple, fast, privacy-focused alternative to Google Analytics.</i>
</p>

<p align="center">
  <a href="https://github.com/adnexustech/analytics/releases">
    <img src="https://img.shields.io/github/release/adnexustech/analytics.svg" alt="GitHub Release" />
  </a>
  <a href="https://github.com/adnexustech/analytics/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/adnexustech/analytics.svg" alt="MIT License" />
  </a>
  <a href="https://github.com/adnexustech/analytics/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/adnexustech/analytics/ci.yml" alt="Build Status" />
  </a>
  <a href="https://analytics.ad.nexus/share/LGazGOecbDtaIwDr/ad.nexus" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/Try%20Demo%20Now-Click%20Here-brightgreen" alt="Analytics Demo" />
  </a>
</p>

---

## 🚀 Getting Started

A detailed getting started guide can be found at [ad.nexus/docs](https://ad.nexus/docs/).

---

## 🛠 Installing from Source

### Requirements

- A server with Node.js version 18.18 or newer
- A database. Analytics supports [MariaDB](https://www.mariadb.org/) (minimum v10.5), [MySQL](https://www.mysql.com/) (minimum v8.0) and [PostgreSQL](https://www.postgresql.org/) (minimum v12.14) databases.

### Get the Source Code and Install Packages

```bash
git clone https://github.com/adnexustech/analytics.git
cd analytics
pnpm install
```

### Configure Analytics

Create an `.env` file with the following:

```bash
DATABASE_URL=connection-url
```

The connection URL format:

```bash
postgresql://username:mypassword@localhost:5432/mydb
mysql://username:mypassword@localhost:3306/mydb
```

### Build the Application

```bash
pnpm run build
```

_The build step will create tables in your database if you are installing for the first time. It will also create a login user with username **admin** and password **analytics**._

### Start the Application

```bash
pnpm run start
```

_By default, this will launch the application on `http://localhost:3000`. You will need to either [proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) requests from your web server or change the [port](https://nextjs.org/docs/api-reference/cli#production) to serve the application directly._

---

## 🐳 Installing with Docker

To build the Analytics container and start up a Postgres database, run:

```bash
docker compose up -d
```

Alternatively, to pull just the Analytics Docker image with PostgreSQL support:

```bash
docker pull docker.ad.nexus/adnexustech/analytics:postgresql-latest
```

Or with MySQL support:

```bash
docker pull docker.ad.nexus/adnexustech/analytics:mysql-latest
```

---

## 🔄 Getting Updates

To get the latest features, simply do a pull, install any new dependencies, and rebuild:

```bash
git pull
pnpm install
pnpm run build
```

To update the Docker image, simply pull the new images and rebuild:

```bash
docker compose pull
docker compose up --force-recreate -d
```

---

## 🛟 Support

<p align="center">
  <a href="https://github.com/adnexustech/analytics">
    <img src="https://img.shields.io/badge/GitHub--blue?style=social&logo=github" alt="GitHub" />
  </a>
  <a href="https://twitter.com/analytics_software">
    <img src="https://img.shields.io/badge/Twitter--blue?style=social&logo=twitter" alt="Twitter" />
  </a>
  <a href="https://linkedin.com/company/adnexustech">
    <img src="https://img.shields.io/badge/LinkedIn--blue?style=social&logo=linkedin" alt="LinkedIn" />
  </a>
  <a href="https://ad.nexus/discord">
    <img src="https://img.shields.io/badge/Discord--blue?style=social&logo=discord" alt="Discord" />
  </a>
</p>

[release-shield]: https://img.shields.io/github/release/adnexustech/analytics.svg
[releases-url]: https://github.com/adnexustech/analytics/releases
[license-shield]: https://img.shields.io/github/license/adnexustech/analytics.svg
[license-url]: https://github.com/adnexustech/analytics/blob/master/LICENSE
[build-shield]: https://img.shields.io/github/actions/workflow/status/adnexustech/analytics/ci.yml
[build-url]: https://github.com/adnexustech/analytics/actions
[github-shield]: https://img.shields.io/badge/GitHub--blue?style=social&logo=github
[github-url]: https://github.com/adnexustech/analytics
[twitter-shield]: https://img.shields.io/badge/Twitter--blue?style=social&logo=twitter
[twitter-url]: https://twitter.com/analytics_software
[linkedin-shield]: https://img.shields.io/badge/LinkedIn--blue?style=social&logo=linkedin
[linkedin-url]: https://linkedin.com/company/adnexustech
[discord-shield]: https://img.shields.io/badge/Discord--blue?style=social&logo=discord
[discord-url]: https://discord.com/invite/4dz4zcXYrQ
