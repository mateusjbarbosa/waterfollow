# Waterfollow API - CHANGELOG

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2024-07-13

### Added

- Add coerce in the POST hydration body schema
- Add id in the GET hydration response object

## [1.0.1] - 2024-07-13

### Fixed

- Add CORS policy that to allow all origins access API

## [1.0.0] - 2024-07-13

### Added

- Add GET endpoint to get hydration history accumulated by period

## [0.3.0] - 2024-07-11

### Added

- Add POST endpoint to insert new hydration registry on database

### Removed

- Remove insertion on database at each reminder

## [0.2.0] - 2024-07-11

### Added

- Set quantity of water ingested at each reminder as 300 milliliters
- Store hydration at each reminder on PostgreSQL database

### Changed

- Update cron job scheduling to repeat at every 30 minutes

## [0.1.1] - 2024-07-11

### Fixed

- Fix cron job scheduling to repeat at every hour at minute 0

## [0.1.0] - 2024-07-11

### Added

- A Cron Job to send reminder at e-mail every hour

## Compare versions

- [v0.1.1](https://github.com/mateusjbarbosa/waterfollow/releases/tag/v0.1.1)
- [v0.1.0](https://github.com/mateusjbarbosa/waterfollow/releases/tag/v0.1.0)
