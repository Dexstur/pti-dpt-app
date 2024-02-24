import Api from "../../api.config";

interface InviteDetail {
  email: string;
}

export default async function InviteDispatch(
  options: InviteDetail,
  type: number
) {
  const inviteType = type ? "staff" : "student";
  return Api.post(`/admin/invite?type=${inviteType}`, options)
    .then(() => {
      return {
        status: true,
        message: "Invite sent",
      };
    })
    .catch((err) => {
      if (err.response) {
        const { status } = err.response;
        if (status === 409) {
          return {
            status: false,
            message: "User already exists",
          };
        }
        if (status === 500) {
          return {
            status: false,
            message: "Internal server error",
          };
        }
      }
      return {
        status: false,
        message: "Network error",
      };
    });
}
