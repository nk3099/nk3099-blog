export const SITE = {
  website: "https://Neeraj.com/", // replace this with your deployed domain
  author: "Neeraj Kumar",
  profile: "https://Neeraj.com/",
  desc: "A personal blog sharing insights, updates, and perspectives on tech, software engineering, and everything in between — straight from the desk of a curious builder.",
  title: "Neeraj Kumar",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Suggest Changes",
    url: "https://github.com/Neeraj/Neeraj.com/edit/main/",
  },
  dynamicOgImage: true,
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Kolkata", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
