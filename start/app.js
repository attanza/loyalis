'use strict'

/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
|
| Providers are building blocks for your Adonis app. Anytime you install
| a new Adonis specific package, chances are you will register the
| provider here.
|
*/
const providers = [
  '@adonisjs/framework/providers/AppProvider',
  '@adonisjs/auth/providers/AuthProvider',
  '@adonisjs/bodyparser/providers/BodyParserProvider',
  '@adonisjs/cors/providers/CorsProvider',
  '@adonisjs/lucid/providers/LucidProvider',
  '@adonisjs/redis/providers/RedisProvider',
  '@adonisjs/validator/providers/ValidatorProvider',
  '@adonisjs/framework/providers/ViewProvider',
  '@adonisjs/lucid-slugify/providers/SlugifyProvider',
  '@adonisjs/mail/providers/MailProvider',
  '@radmen/adonis-lucid-soft-deletes/providers/SoftDeletesProvider',
  'adonis-acl/providers/AclProvider',
  'adonis-cache/providers/CacheProvider',
  'adonis-throttle/providers/ThrottleProvider',
]

/*
|--------------------------------------------------------------------------
| Ace Providers
|--------------------------------------------------------------------------
|
| Ace providers are required only when running ace commands. For example
| Providers for migrations, tests etc.
|
*/
const aceProviders = [
  '@adonisjs/lucid/providers/MigrationsProvider',
  'adonis-acl/providers/CommandsProvider',
  'adonis-cache/providers/CommandsProvider',
  '@adonisjs/vow/providers/VowProvider',
]

/*
|--------------------------------------------------------------------------
| Aliases
|--------------------------------------------------------------------------
|
| Aliases are short unique names for IoC container bindings. You are free
| to create your own aliases.
|
| For example:
|   { Route: 'Adonis/Src/Route' }
|
*/
const aliases = {
  Role: 'Adonis/Acl/Role',
  Permission: 'Adonis/Acl/Permission',
  Cache: 'Adonis/Addons/Cache',
  Throttle: 'Adonis/Addons/Throttle',
}

/*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
|
| Here you store ace commands for your package
|
*/
const commands = ['App/Commands/Service']

module.exports = { providers, aceProviders, aliases, commands }
