import { gql, useQuery } from "@apollo/client";

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      email
    }
  }
`;

const Users = () => {
  const {loading, error, data} = useQuery(GET_USERS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {data.getUsers.map((user: any) => (
          <li key={user.email}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default Users;