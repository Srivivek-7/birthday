# Open the birthday site on your phone

Follow these steps **on your Mac** (use the **Terminal** app, not Cursor):

## Step 1: Open Terminal
Open **Terminal** (Applications → Utilities → Terminal, or press Cmd+Space and type “Terminal”).

## Step 2: Go to the project and start the server
Copy and paste these two commands, then press Enter after each:

```bash
cd /Users/srivivekchowdarymallampati/Documents/siri/birthday
npm run dev:mobile
```

## Step 3: Find the Network URL
In the Terminal output you’ll see something like:

```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.10:5173/
```

Copy the **Network** URL (the one that starts with `192.168.` or `10.0.`).

## Step 4: On your phone
1. Connect your phone to the **same Wi‑Fi** as your Mac.
2. Open the browser (Chrome, Safari, etc.).
3. Paste the **Network** URL in the address bar (e.g. `http://192.168.1.10:5173`).
4. Press Go.

Do **not** use `localhost` on the phone — that won’t work. Use only the Network URL.

## Step 5: Unlock
Enter the password: **Boostuu**

---

**If you don’t see a “Network” line:** Your firewall may be blocking it. On Mac: System Settings → Network → Firewall → allow Node or your terminal app. Or try turning the firewall off temporarily to test.
