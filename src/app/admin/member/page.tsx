import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { cn } from "@/lib/utils";

const STATUS_TABS = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
] as const;

type MemberStatus = (typeof STATUS_TABS)[number]["value"];

function isMemberStatus(value: string | undefined): value is MemberStatus {
  return STATUS_TABS.some((tab) => tab.value === value);
}

export default async function AdminMemberPage(props: PageProps<"/admin/member">) {
  await requireAdmin();

  const searchParams = await props.searchParams;
  const statusParam = Array.isArray(searchParams.status) ? searchParams.status[0] : searchParams.status;
  const status: MemberStatus = isMemberStatus(statusParam) ? statusParam : "PENDING";

  const members = await prisma.user.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ct-blue">Kelola Member</h1>

      <div className="mt-4 flex gap-2">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/member?status=${tab.value}`}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              status === tab.value
                ? "bg-ct-teal text-white"
                : "bg-white text-foreground/70 hover:bg-ct-teal/10"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {members.length === 0 ? (
          <p className="rounded-2xl border border-ct-teal/10 bg-white p-6 text-center text-foreground/60">
            Tidak ada member dengan status ini.
          </p>
        ) : (
          members.map((member) => (
            <div key={member.id} className="rounded-2xl border border-ct-teal/10 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ct-blue">{member.name ?? "(tanpa nama)"}</p>
                  <p className="text-sm text-foreground/60">{member.email}</p>
                  {member.storeName ? (
                    <p className="text-sm text-foreground/60">Toko: {member.storeName}</p>
                  ) : null}
                  <p className="text-sm text-foreground/60">WA: {member.whatsapp ?? "-"}</p>
                  {member.address ? (
                    <p className="mt-1 max-w-md text-sm text-foreground/70">{member.address}</p>
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
                        <button
                          type="submit"
                          className="rounded-full bg-ct-green px-4 py-2 text-sm font-semibold text-white hover:bg-ct-green/90"
                        >
                          Approve
                        </button>
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
                        <button
                          type="submit"
                          className="rounded-full bg-ct-red px-4 py-2 text-sm font-semibold text-white hover:bg-ct-red/90"
                        >
                          Reject
                        </button>
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
                      <button
                        type="submit"
                        className="rounded-full border border-ct-orange px-4 py-2 text-sm font-semibold text-ct-orange hover:bg-ct-orange/10"
                      >
                        Revoke
                      </button>
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
                      <button
                        type="submit"
                        className="rounded-full bg-ct-green px-4 py-2 text-sm font-semibold text-white hover:bg-ct-green/90"
                      >
                        Approve
                      </button>
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
