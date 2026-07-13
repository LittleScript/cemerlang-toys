import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { cn } from "@/lib/utils";
import { SubmitButton } from "@/components/ui/submit-button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { StatusBadge } from "@/components/admin/ui/status-badge";

const STATUS_TABS = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
] as const;

type MemberStatus = (typeof STATUS_TABS)[number]["value"];

function isMemberStatus(value: string | undefined): value is MemberStatus {
  return STATUS_TABS.some((tab) => tab.value === value);
}

const statusBadgeVariant: Record<MemberStatus, "warning" | "success" | "danger"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

export default async function AdminMemberPage(
  props: PageProps<"/admin/member">
) {
  await requireAdmin();

  const searchParams = await props.searchParams;
  const statusParam = Array.isArray(searchParams.status)
    ? searchParams.status[0]
    : searchParams.status;
  const status: MemberStatus = isMemberStatus(statusParam)
    ? statusParam
    : "PENDING";

  const members = await prisma.user.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Kelola Member" />

      <div className="mt-4 flex gap-2">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/member?status=${tab.value}`}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              status === tab.value
                ? "bg-[var(--brand)] text-[var(--text-on-brand)]"
                : "bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--brand-muted)]"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {members.length === 0 ? (
          <p
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-[var(--text-muted)]"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            Tidak ada member dengan status ini.
          </p>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[var(--text-primary)]">
                      {member.name ?? "(tanpa nama)"}
                    </p>
                    <StatusBadge variant={statusBadgeVariant[status]}>
                      {status === "PENDING"
                        ? "Pending"
                        : status === "APPROVED"
                          ? "Approved"
                          : "Rejected"}
                    </StatusBadge>
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">
                    {member.email}
                  </p>
                  {member.storeName ? (
                    <p className="text-sm text-[var(--text-muted)]">
                      Toko: {member.storeName}
                    </p>
                  ) : null}
                  <p className="text-sm text-[var(--text-muted)]">
                    WA: {member.whatsapp ?? "-"}
                  </p>
                  {member.address ? (
                    <p className="mt-1 max-w-md text-sm text-[var(--text-secondary)]">
                      {member.address}
                    </p>
                  ) : null}
                </div>

                <div className="flex gap-2">
                  {status === "PENDING" ? (
                    <>
                      <form
                        action={async () => {
                          "use server";
                          await requireAdmin();
                          await prisma.user.update({
                            where: { id: member.id },
                            data: { status: "APPROVED" },
                          });
                          revalidatePath("/admin/member");
                        }}
                      >
                        <SubmitButton className="rounded-full px-4 py-2 text-sm font-semibold">
                          Approve
                        </SubmitButton>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await requireAdmin();
                          await prisma.user.update({
                            where: { id: member.id },
                            data: { status: "REJECTED" },
                          });
                          revalidatePath("/admin/member");
                        }}
                      >
                        <SubmitButton
                          variant="danger"
                          className="rounded-full px-4 py-2 text-sm font-semibold"
                        >
                          Reject
                        </SubmitButton>
                      </form>
                    </>
                  ) : null}

                  {status === "APPROVED" ? (
                    <form
                      action={async () => {
                        "use server";
                        await requireAdmin();
                        await prisma.user.update({
                          where: { id: member.id },
                          data: { status: "PENDING" },
                        });
                        revalidatePath("/admin/member");
                      }}
                    >
                      <SubmitButton
                        variant="secondary"
                        className="rounded-full px-4 py-2 text-sm font-semibold"
                      >
                        Revoke
                      </SubmitButton>
                    </form>
                  ) : null}

                  {status === "REJECTED" ? (
                    <form
                      action={async () => {
                        "use server";
                        await requireAdmin();
                        await prisma.user.update({
                          where: { id: member.id },
                          data: { status: "APPROVED" },
                        });
                        revalidatePath("/admin/member");
                      }}
                    >
                      <SubmitButton className="rounded-full px-4 py-2 text-sm font-semibold">
                        Approve
                      </SubmitButton>
                    </form>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
