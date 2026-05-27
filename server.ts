import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware with increased payload limit to fit entire state if needed
  app.use(express.json({ limit: "20mb" }));

  const STATE_FILE = path.join(process.cwd(), "shared_state.json");
  const USERS_FILE = path.join(process.cwd(), "registered_users.json");

  // Helper to read registered users from disk
  const readUsers = () => {
    try {
      if (fs.existsSync(USERS_FILE)) {
        return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
      }
    } catch (e) {
      console.error("Error reading users file:", e);
    }
    return [];
  };

  // Helper to write registered users to disk
  const writeUsers = (users: any[]) => {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing users file:", e);
    }
  };

  // Helper to check if a user is admin
  const isUserAdmin = (email: string, name: string) => {
    const e = (email || "").toLowerCase().trim();
    const n = (name || "").toLowerCase().trim();
    return e === "inglizvera@gmail.com" || n.includes("ericka") || n.includes("erika");
  };

  // API Route: Check Health
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route: Register/Login user on server for cross-device visibility
  app.post("/api/users/register", (req, res) => {
    try {
      const { email, name, avatarUrl, provider, password } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, msg: "Falta el correo electrónico." });
      }

      const trimmedEmail = email.toLowerCase().trim();
      const users = readUsers();

      const existingIdx = users.findIndex((u: any) => u.email === trimmedEmail);
      const userData = {
        email: trimmedEmail,
        name: name || trimmedEmail.split("@")[0],
        avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name || trimmedEmail)}`,
        provider: provider || "email",
        password: password || "", // Saved for simple demonstration to sync password across devices
        registeredAt: new Date().toISOString()
      };

      if (existingIdx >= 0) {
        const targetUser = users[existingIdx];
        // If it's email provider, we confirm password to act as simple credential store
        if (userData.provider === "email" && password && targetUser.password && targetUser.password !== password) {
          return res.status(401).json({ success: false, msg: "Contraseña incorrecta." });
        }
        users[existingIdx] = { ...targetUser, ...userData };
      } else {
        users.push(userData);
      }

      writeUsers(users);
      return res.json({ success: true, user: users.find((u: any) => u.email === trimmedEmail) });
    } catch (err: any) {
      console.error("Error registering user on server:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Get all registered family members (useful for admins to white list from)
  app.get("/api/registered-users", (req, res) => {
    try {
      const users = readUsers();
      // Safeguard: Exclude raw password from sending over HTTP
      const safeUsers = users.map(({ password, ...u }: any) => u);
      return res.json({ success: true, users: safeUsers });
    } catch (err: any) {
      console.error("Error fetching users from server:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Get Shared State
  app.get("/api/shared-state", (req, res) => {
    try {
      if (fs.existsSync(STATE_FILE)) {
        const data = fs.readFileSync(STATE_FILE, "utf-8");
        return res.json({ success: true, state: JSON.parse(data) });
      } else {
        return res.json({ success: false, msg: "No shared state active yet. First admin sync will initialize it." });
      }
    } catch (err: any) {
      console.error("Error reading shared state:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: Save Shared State (Admin Only)
  app.post("/api/shared-state", (req, res) => {
    try {
      const { email, name, state } = req.body;

      if (!isUserAdmin(email, name)) {
        return res.status(403).json({
          success: false,
          msg: "Permiso denegado. Solo la administradora (Ericka) de esta cuenta de Lety App v3 puede editar y guardar cambios en la nube familiar."
        });
      }

      if (!state) {
        return res.status(400).json({ success: false, msg: "Falta el objeto de estado." });
      }

      // Save the state to disk
      fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
      return res.json({ success: true, msg: "¡Estado sincronizado con la nube de Lety App v3!" });
    } catch (err: any) {
      console.error("Error writing shared state:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite middleware setup (development vs production static)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
