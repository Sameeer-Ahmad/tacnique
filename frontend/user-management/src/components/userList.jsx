import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  VStack,
  Text,
  IconButton,
  useDisclosure,
  Flex,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Skeleton,
  useToast
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import UserForm from "./userForm";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

useEffect(() => {
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users");
        setUsers(response.data);
        localStorage.setItem("users", JSON.stringify(response.data));
      }
    } catch (error) {
      setError("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);

useEffect(() => {
  localStorage.setItem("users", JSON.stringify(users));
}, [users]);


  const handleAddUser = () => {
    setEditUser(null);
    onOpen();
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    onOpen();
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      toast({
        title: "User deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting user.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = [...users]
    .reverse()
    .slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <VStack spacing={4} p={5} align="stretch"  width={["214%", "100%", "100%"]}  bgGradient="linear(to-r, green.100, yellow.400, red.300)">
      <Text fontSize={{ base: "lg", md: "xl", lg: "2xl" }} textAlign="center" fontWeight="bold">
        User List
      </Text>
      <Flex direction={{ base: "column", md: "row" }} align="center" gap={4} mb={4} ml={1}>
        <Text fontWeight="bold">Add a new user</Text>
        <IconButton
          icon={<AddIcon />}
          colorScheme="teal"
          aria-label="Add User"
          onClick={handleAddUser}
          size={{ base: "sm", md: "md" }}
        />
      </Flex>
      {loading ? (
        <Table variant="simple" size="sm" overflowX="auto">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Username</Th>
              <Th>Email</Th>
              <Th>Website</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.from({ length: usersPerPage }).map((_, index) => (
              <Tr key={index}>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : error ? (
        <Text color="red.500" textAlign="center">{error}</Text>
      ) : (
        <Table variant="simple" size="sm" overflowX="auto">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Username</Th>
              <Th>Email</Th>
              <Th>Website</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentUsers.map((user) => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.username}</Td>
                <Td>{user.email}</Td>
                <Td>{user.website}</Td>
                <Td>
                  <HStack spacing={2} justify="flex-start" wrap="wrap">
                    <IconButton
                      icon={<EditIcon />}
                      colorScheme="blue"
                      aria-label="Edit User"
                      onClick={() => handleEditUser(user)}
                      size="sm"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      aria-label="Delete User"
                      onClick={() => handleDeleteUser(user.id)}
                      size="sm"
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      <HStack spacing={4} mt={4} justify="center">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          size="sm"
        >
          Previous
        </Button>
        <Text>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          size="sm"
        >
          Next
        </Button>
      </HStack>
      <UserForm
        isOpen={isOpen}
        onClose={onClose}
        user={editUser}
        setUsers={setUsers}
      />
    </VStack>
  );
  
  
};

export default UserList;
