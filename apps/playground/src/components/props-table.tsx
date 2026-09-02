export type PropDoc = {
  name: string;
  type: string;
  defaultValue?: string;
  note?: string;
};

export function PropsTable({ docs }: { docs: PropDoc[] }) {
  return (
    <table className="w-full table-auto border-collapse text-left align-top">
      <thead>
        <tr>
          {["Prop", "Type", "Default"].map((heading) => (
            <th
              key={heading}
              className="border-b border-line pb-2 pr-3 text-xs leading-none font-normal text-ink-3"
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {docs.map((doc) => (
          <tr key={doc.name} className="border-b border-line-subtle last:border-b-0">
            <td className="py-2 pr-3 align-top">
              <code className="font-mono text-xs leading-none text-ink">{doc.name}</code>
              {doc.note ? (
                <span className="mt-1 block text-xs leading-snug text-ink-3">{doc.note}</span>
              ) : null}
            </td>
            <td className="py-2 pr-3 align-top text-xs whitespace-nowrap text-ink-2">{doc.type}</td>
            <td className="py-2 align-top text-xs whitespace-nowrap text-ink-2">
              {doc.defaultValue ? (
                <code className="font-mono text-xs text-ink">{doc.defaultValue}</code>
              ) : (
                "—"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
