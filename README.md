# abstimmung.eu

## Development Setup

### Environment

```bash
cp .env.example .env
```

Edit the `.env` file with your own values (database credentials, etc.)

### Development Server

```bash
./vendor/bin/sail up -d
```

```bash
./vendor/bin/sail artisan migrate
```

```bash
./vendor/bin/sail artisan db:seed
```

## Table Structure

### Votes
