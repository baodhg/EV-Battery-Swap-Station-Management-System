## EVSwap Backend – Environment Configuration

1. Copy the provided template:
   ```bash
   cp env.example .env
   ```
2. Update `.env` with your local credentials:
   - `SPRING_DATASOURCE_*` for SQL Server connection.
   - `MAIL_*` for SMTP notifications (optional in dev).
   - `GOOGLE_CLIENT_ID`, `JWT_*`, and `PAYPAL_*` for auth/payment flows.
3. Ensure the frontend URL matches your dev server if you expose new CORS origins.

> The backend reads `.env` at startup (Spring Boot dotenv support). Restart the server after editing.

