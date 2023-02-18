import { withSentry } from "@sentry/nextjs";
import { getAds } from "@lib/helpers";

const handler = async (req, res) => {
  const { id, adSize } = req.query;

  try {
    const event = await getAds({ id, adSize });

    res.status(200).json(event || {});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export default withSentry(handler);
