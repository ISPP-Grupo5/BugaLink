type UserI = {
  id: number;
  date_joined: string;
  email: string;
  first_name: string;
  last_name: string;
  photo: string | null;
  passenger: number;
  driver: number | null;
};

export default UserI;
