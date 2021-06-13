type User = {
  /** uid */
  uid: number;

  id: number;
  /** 名前 */
  name: string;

  profile: string;
  college: string;
  faculty: string;
  department: string;

  hub_list: string[];
};

export default User;
