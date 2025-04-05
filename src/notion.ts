const notionKey = process.env.NOTION_API_KEY;

export const validate = () => {
  if (!notionKey) {
    throw new Error("NOTION_API_KEY is not set");
  }
};
