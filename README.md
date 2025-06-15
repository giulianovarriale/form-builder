Inspired by [a post from Yangshun Tay](https://www.linkedin.com/feed/update/urn:li:activity:7317396289673916418?updateEntityUrn=urn%3Ali%3Afs_updateV2%3A%28urn%3Ali%3Aactivity%3A7317396289673916418%2CFEED_DETAIL%2CEMPTY%2CDEFAULT%2Cfalse%29), CEO of GreatFrontEnd, I decided to build my own form builder as an exercise.

https://github.com/user-attachments/assets/edaa0e9d-1797-4713-a0d7-b7130a09e7c4

[See it live!](https://form-builder-kappa-orcin.vercel.app/)

**🚧 This project is and will always be a work in progress**

## TO DO
* [ ] AI (of course): allow the users to build forms using an internal AI agent
* [x] Perceived Performance: make sure we add proper feedback when action are performed (loading and pending states)
* [x] Responsiveness: make sure user can use the app on mobile
* [ ] Real Performance: investigate if it is possible to improve response time 
* [ ] Accessibility: make sure keyboard users can use the app
* [ ] Accessibility: make sure screen reader users can use the app
* [ ] Accessiblity: evaluate color contrast


## Getting Started

This app uses Supabase. So in order to run it locally, you will have to:
* Create a Supabase project
* Create a .env file and paste some Supabase credentials on it.

```.env
# Go to your supabase project, then go to "Project Settings" > "Data API"
SUPABASE_URL=_supabase_project_url_here
# Go to your project, then go to "Project Settings" > "API Keys"
SUPABASE_ANON_KEY=supabase_anon_key_here

# Go to your supabase project and click on the button "connect" located in the header of the page > click on the "ORMs" tab > select "Prisma" on tools.
# Don't forget to replace the [YOUR-PASSWORD] with the real database password from your project.
DATABASE_URL=supabase_database_url_here
DIRECT_URL=supabase_direct_url_here
```
Once you have the environment variables set, run the commands below:
```bash
# To install dependencies
pnpm install

# To apply pending database migrations
pnpm exec prisma migrate dev

# To start the nextjs application
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
