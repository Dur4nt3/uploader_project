# File Uploader

## File Uploader - Overview

This is the fifth project of the "NodeJS" course within "The Odin Project".

This project is used to practice the usage of an ORM (Prisma) in a backend application.

In particular, this project aims to create a platform where you can host and share images.

**You can view this project at: https://dantes-uploader.up.railway.app**

## Important Notes

### TypeScript Usage

This project is solely using TypeScript because `prisma-client-js` is deprecated, thus requiring me to use `prisma-client` which requires TypeScript.
Therefore, in various parts of the project I've opted to use the simplest types to allow the application to compile.

### High-Severity Vulnerabilities

When installing the project's package you may come across 3 high severity vulnerabilities that are reported by npm.

The reported vulnerability comes from hono, which is used indirectly by Prisma for internal CLI tooling and relates to JWT handling in HTTP middleware.
Prisma does not use JWTs or expose HTTP servers in this project, and the affected code is never executed or reachable at runtime.
Therefore, the issue has no practical attack surface and does not impact the security of the application.

## Skills Demonstrated

- ORM

- Prisma

- Prisma Migrations

- File Upload


