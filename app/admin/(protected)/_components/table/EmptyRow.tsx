export function EmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td className="px-4 py-3 text-neutral-500" colSpan={colSpan}>
        {message}
      </td>
    </tr>
  );
}
