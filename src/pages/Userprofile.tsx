import {
  Box,
  Flex,
  Avatar,
  Text,
  Heading,
  Stack,
  Button,
  Input,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';

const UserProfile: React.FC = () => {
  const data = useSelector((state: any) => state.auth);

 
  const cardBg = useColorModeValue('#ffffff2e', '#1a202c');
  const inputBg = useColorModeValue('#ffffff2e', '#2d3748');
  const textColor = useColorModeValue('#fff', '#edf2f7');
  const labelColor = useColorModeValue('#fff', 'gray.300');

  return (
    <Box
      minH="100vh"
      py={10}
      px={4}
    >
      <Flex justify="center" align="center">
        <Box
          w={{ base: '100%', md: '100%', lg: '40%' }}
          bg={cardBg}
          p={8}
          boxShadow="2xl"
          borderRadius="2xl"
        >
          <Flex direction="column" align="center" mb={6}>
            <Avatar
              size="xl"
              name={`${data.firstname} ${data.lastname}`}
              mb={4}
              src={data.avatarUrl}
            />
            <Heading size="lg" color={textColor}>
              {data.firstname} {data.lastname}
            </Heading>
           
          </Flex>

          <Divider mb={6} />    

          <Stack spacing={4}>
            <Box>
              <Text fontWeight="semibold" color={labelColor} mb={1}>
                First Name
              </Text>
              <Input value={data.firstname} border="gray" color="white" isReadOnly bg={inputBg} />
            </Box>

            <Box>
              <Text fontWeight="semibold" color={labelColor} mb={1}>
                Last Name
              </Text>
              <Input value={data.lastname} border="gray" color="white"  isReadOnly bg={inputBg} />
            </Box>

            <Box>
              <Text fontWeight="semibold"  color={labelColor} mb={1}>
                Email
              </Text>
              <Input value={data.email} border="gray" color="white"  isReadOnly bg={inputBg} />
            </Box>

            <Box>
              <Text fontWeight="semibold" color={labelColor} mb={1}>
                Phone
              </Text>
              <Input value={data.phone} border="gray" color="white"  bg={inputBg}  />
            </Box>

            <Button
              colorScheme="blue"
              width="full"
              mt={4}
              fontWeight="bold"
              cursor="default"
            >
               Update Profile
            </Button>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};

export default UserProfile;
