# **App Name**: NoNepa Solar Audit

## Core Features:

- Onboarding: Onboarding with rotating 'NEPA failure' stats and a live counter.
- Appliance Input: Appliance Input: Allow users to input appliance quantities (TV, Fan, Bulb, etc.). Implement a custom name and manual voltage input for 'Others'.
- Location Selection: Location selection (Lagos & Abuja) with default average solar hours per city, fetched from `admin-config.json`.
- Backup Duration: Backup Duration: Users choose how long solar should last after a power outage (2h, 4h, 6h, 8h, 24h).
- Summary Display: Summary Page: Displays total wattage/kWh/day, inverter size, battery specs, solar panel count & wattage, and estimated hours of power, all with tooltips.
- Package Recommendation: Package Recommendation: Shows 3+ solar packages side-by-side with title, specs, photo, and estimated cost, linking to contact page.
- Contact: Contact Page: 'Wetin you think? Talk to our support person.' display contact information including whatsapp

## Style Guidelines:

- Primary color: A vibrant, sun-inspired yellow (#FFC72C) to evoke energy and optimism.
- Background color: Light gray (#F0F0F0), almost white, to provide a clean backdrop.
- Accent color: A complementary orange (#FF9000) for calls to action, highlights, and key information.
- Body and headline font: 'PT Sans' for clear and modern text, suitable for headlines or body text.
- Use custom icons relevant to each appliance type (TV, fan, bulb etc.), plus solar-themed icons (sun, battery, panels).
- Mobile-first, responsive layout with a clear progression through the audit steps. Utilize a progress bar to indicate completion.
- Subtle animations for loading states and transitions between steps to keep the user engaged.