import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  VStack,
  Box,
  Text,
  IconButton,
  useDisclosure,
  Flex,
  SimpleGrid,
  HStack,
  Skeleton,
  SkeletonText,
  useToast
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import UserForm from "./UserForm";

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
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        setUsers(response.data);
      } catch (error) {
        setError("Error fetching users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
    <VStack spacing={4} p={5} align="stretch" bgGradient='linear(to-r, green.100, yellow.400, red.300)'>
      <Text fontSize="2xl" textAlign="center" fontWeight="bold">
        User List
      </Text>
      <Flex align="center" gap={4} mb={4} ml={1}>
        <Text fontWeight="bold">Add a new user</Text>
        <IconButton
          icon={<AddIcon />}
          colorScheme="teal"
          aria-label="Add User"
          onClick={handleAddUser}
        />
      </Flex>
      {loading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {Array.from({ length: usersPerPage }).map((_, index) => (
            <Box
              key={index}
              p={4}
              borderWidth={1}
              borderRadius="md"
              boxShadow="md"
              background="gray.300"
            >
              <Skeleton height="60px" mb={4} />
              <Skeleton height="20px" mb={2} />
              <Skeleton height="20px" mb={2} />
              <Skeleton height="20px" />
            </Box>
          ))}
        </SimpleGrid>
      ) : error ? (
        <Text color="red.500" textAlign="center">{error}</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {currentUsers.map((user) => (
            <Box
              key={user.id}
              p={4}
              borderWidth={1}
              borderRadius="md"
              boxShadow="md"
              background="gray.300"
            >
              <Flex direction="column" h="full" justify="space-between">
                <Box>
                  <Text fontWeight="bold">Name: {user.name}</Text>
                  <Text>Username: {user.username}</Text>
                  <Text>Email: {user.email}</Text>
                  <Text>Website: {user.website}</Text>
                </Box>
                <Box mt={4}>
                  <Flex justify="space-between">
                    <IconButton
                      icon={<EditIcon />}
                      colorScheme="blue"
                      aria-label="Edit User"
                      onClick={() => handleEditUser(user)}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      aria-label="Delete User"
                      ml={2}
                      onClick={() => handleDeleteUser(user.id)}
                    />
                  </Flex>
                </Box>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      )}
      <HStack spacing={4} mt={4} justify="center">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Text>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
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
