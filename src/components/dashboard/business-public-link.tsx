type BusinessPublicLinkProps = {
  name: string;
  slug: string;
};

export const BusinessPublicLink = ({ name, slug }: BusinessPublicLinkProps) => {
  return (
    <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
      <h2 className="text-xl font-semibold text-green-800">{name}</h2>

      <p className="mt-2 text-green-700">Tu página pública:</p>

      <a
        href={`/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block font-mono text-sm font-semibold text-indigo-600 hover:underline"
      >
        turnero.com/{slug}
      </a>
    </div>
  );
};
