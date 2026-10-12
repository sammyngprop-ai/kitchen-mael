# Kitchen Mael – Meal Logger

Logs Mama's and Papa's meals (Breakfast, Lunch, Teatime, Dinner, Supper) to a Google Sheet, with a photo taken by camera or uploaded.

## Setup (5 minutes)

1. Create a new Google Sheet.
2. **Extensions → Apps Script**. Delete the default code, paste in `Code.gs`, save.
3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy, authorize when asked, and copy the **Web app URL** (ends in `/exec`).
4. Host `index.html` anywhere static (GitHub Pages, Netlify Drop, Cloudflare Pages), or just open it locally.
   - Camera capture on phones needs **HTTPS** (all the hosts above provide it).
5. Open `index.html`, paste the Web app URL into `const SCRIPT_URL = '';` near the top of the script, and save.

## What happens on save
- A `Meals` tab is created in your sheet: Logged At | Date | Person | Meal | Description | Photo Link | Photo.
- The photo is saved to a Drive folder `KitchenMael Photos` (link-viewable) and shown in the sheet through `=IMAGE()`.
- After editing `Code.gs`, redeploy via **Deploy → Manage deployments → Edit → New version**.

Note: anyone with the Web app URL can add rows, so keep it private.
