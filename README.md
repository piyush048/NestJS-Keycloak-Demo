# 🚀 NestJS + Keycloak Group-Based Access Control

This project demonstrates how to secure a NestJS application using **Keycloak** and implement a custom **JWT guard** that checks whether the user belongs to a specific group — in this case, `Marketing & CRM` or `Aqua & Lab` and whether user have the specific permission like `campaign-create`, `checkout-forms-view` etc.

This project also inclue the user registration and login functionality using **Keycloak** and **Role** assignment to the user and group assignment to the user.

## 🧩 Features

- JWT token extraction from the `Authorization` header
- Keycloak group-based access restriction
- Controller-level guard application
- Decoded JWT payload inspection
- Plug-and-play custom guard for any group name

---

## 🛠 Tech Stack

- [NestJS](https://nestjs.com/)
- [Keycloak](https://www.keycloak.org/)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [Express](https://expressjs.com/)

---

## 📦 Installation

```bash
npm install
```

---

## ▶️ Running the App

```bash
npm run start:dev
```

---

## 🧪 Sample Routes

| Endpoint             | Method | Protection            | Description                          |
|----------------------|--------|------------------------|--------------------------------------|
| `/marketing/test` | GET    | `Marketing & CRM` group | Accessible only to users in that group |
| `/marketing/campaign-create`   | GET    | `Marketing & CRM` group | Accessible only to users with the role campaign create |

---

## 🔐 Keycloak Setup

1. **Create a Realm** and a **Client** in Keycloak.
2. Enable `groups` in the token:
   - Go to your **client → Client Scopes → Mappers**
   - Add a **Group Membership** mapper:
     - Name: `groups`
     - Mapper Type: `Group Membership`
     - Token Claim Name: `groups`
     - Add to ID token and Access token ✅
3. Assign users to the `Marketing & CRM` group.

---

## 🧠 How the Guard Works

Located in: `src/guards/marketing-crm-group.guard.ts`

```ts
@UseGuards(MarketingCrmGroupGuard)
@Controller('marketing')
export class MarketingController {
  @Get('dashboard')
  getDashboard() {
    return 'Welcome to Marketing & CRM dashboard!';
  }
}
```

### Guard Logic:
- Extracts `Bearer` token from headers
- Decodes JWT
- Checks if `groups` includes `Marketing & CRM`
- Grants or denies access accordingly

---

## 📁 Project Structure

```
src/
├── guards/
│       └── marketing-crm-group.guard.ts
│       └── role.guard.ts
├── protectedRoutes/
│   └── marketing-crm.controller.ts
|   └── aquq-lab.controller.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
├── main.ts
```

---

## 📝 License

MIT

---

## 🤝 Contributing

PRs and suggestions welcome! Open an issue or submit a pull request.