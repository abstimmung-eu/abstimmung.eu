# Local Development

```bash
git clone https://github.com/abstimmung-eu/abstimmung.eu.git
cd abstimmung.eu
```

```bash
cp .env.example .env
```

Edit the `.env` file with your own values (database credentials, etc.)

Start the docker containers:

```bash
./vendor/bin/sail up
```

Install dependencies:

```bash
./vendor/bin/sail composer install
./vendor/bin/sail npm i
```

Generate a new application key:

```bash
./vendor/bin/sail artisan key:generate
```

Migrate the database:

```bash
./vendor/bin/sail artisan migrate:fresh
```

Start the development server:

```bash
./vendor/bin/sail npm run dev
```

Open the application in your browser: [http://localhost](http://localhost).
