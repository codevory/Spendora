export async function getServerHealth(req, res) {
  return res.status(200).json({ response: "server alive" });
}
