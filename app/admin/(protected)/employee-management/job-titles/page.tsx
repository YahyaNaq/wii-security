import { prisma } from "../../../../lib/db";
import { formatPkr } from "../../../../lib/format";
import { parseListParams } from "../../_lib/list-params";
import { Pagination } from "../../_components/table/Pagination";
import { EmptyRow } from "../../_components/table/EmptyRow";
import { AddJobTitleButton } from "./AddJobTitleButton";
import { JobTitleRowActions } from "./JobTitleRowActions";
import { createJobTitle, updateJobTitle, deleteJobTitle } from "./actions";

const actions = { create: createJobTitle, update: updateJobTitle, delete: deleteJobTitle };

export default async function AdminJobTitlesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const { page, pageSize, skip, take } = parseListParams(resolvedSearchParams, {
    allowedSort: [],
    defaultSort: "title",
  });

  const [jobTitles, total] = await Promise.all([
    prisma.jobTitle.findMany({ orderBy: { title: "asc" }, skip, take }),
    prisma.jobTitle.count(),
  ]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Job Titles</h1>
        <AddJobTitleButton actions={actions} />
      </div>
      <p className="mb-6 text-sm text-neutral-500">
        Job titles are assigned to employees and carry a per-gig salary rate.
      </p>

      <div className="h-[65vh] overflow-auto rounded-lg border border-neutral-800">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-neutral-950">
            <tr className="border-b border-neutral-800 text-neutral-400">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Salary (per gig)</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobTitles.map((jobTitle, index) => (
              <tr key={jobTitle.id} className="border-b border-neutral-800 last:border-0">
                <td className="px-4 py-3 text-neutral-500">{skip + index + 1}</td>
                <td className="px-4 py-3">{jobTitle.title}</td>
                <td className="px-4 py-3">{formatPkr(jobTitle.salary)}</td>
                <td className="px-4 py-3 text-right">
                  <JobTitleRowActions jobTitle={jobTitle} actions={actions} />
                </td>
              </tr>
            ))}
            {jobTitles.length === 0 && <EmptyRow colSpan={4} message="No job titles configured." />}
          </tbody>
        </table>
      </div>

      <Pagination
        pathname="/admin/employee-management/job-titles"
        searchParams={resolvedSearchParams}
        page={page}
        pageSize={pageSize}
        total={total}
      />
    </div>
  );
}
