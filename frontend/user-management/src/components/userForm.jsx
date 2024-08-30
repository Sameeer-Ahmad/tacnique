import  { useState, useEffect } from 'react';
import { Button, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, FormControl, FormLabel } from '@chakra-ui/react';
import axios from 'axios';

const UserForm = ({ isOpen, onClose, user, setUsers }) => {
  const [formData, setFormData] = useState({ name: '', username: '', email: '', website: '' });
  const isEdit = user !== null;

  useEffect(() => {
    if (isEdit && user) {
      setFormData({ name: user.name, username: user.username, email: user.email, website: user.website });
    } else {
      setFormData({ name: '', username: '', email: '', website: '' });
    }
  }, [user, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await axios.put(`https://jsonplaceholder.typicode.com/users/${user.id}`, formData);
        setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, ...formData } : u)));
      } else {
        const response = await axios.post('https://jsonplaceholder.typicode.com/users', formData);
        setUsers(prev => [...prev, response.data]);
      }
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEdit ? 'Edit User' : 'Add User'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired mb={3}>
            <FormLabel>Name</FormLabel>
            <Input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
          </FormControl>
          <FormControl isRequired mb={3}>
            <FormLabel>Username</FormLabel>
            <Input name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
          </FormControl>
          <FormControl isRequired mb={3}>
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          </FormControl>
          <FormControl isRequired mb={3}>
            <FormLabel>Website</FormLabel>
            <Input name="website" value={formData.website} onChange={handleChange} placeholder="Website" />
          </FormControl>
          <Button mt={4} colorScheme="teal" onClick={handleSubmit}>
            {isEdit ? 'Save Changes' : 'Add User'}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserForm;
