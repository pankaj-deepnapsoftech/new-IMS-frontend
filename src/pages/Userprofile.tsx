import {
  Box,
  Flex,
  Avatar,
  Text,
  Heading,
  Stack,
  Button,
  Input,
  Textarea,
} from '@chakra-ui/react';


const Userprofile: React.FC = () => {
  return (
    <div  className="rounded-md ">
      <Flex
        direction="column"
        align="center"
        p={5}
        minH="100vh"
      >
        <Box
          w={{ base: '100%', md: '70%', lg: '50%' }}
          background="#ffffff63"
          p={8}
          boxShadow="lg"
          borderRadius="lg"
        >
          <Flex direction="column" align="center" mb={6}>
            <Avatar size="2xl" name="John Doe" src="https://bit.ly/dan-abramov" />
            <Heading mt={4} color="#fff" size="lg">
              John Doe
            </Heading>
            <Text color="#fff" mt={2}>
              Full Stack Developer at XYZ Inc.
            </Text>
          </Flex>

          <Stack spacing={4}>
            <Box>
              <Text color="#fff" fontWeight="semibold">Email</Text>
              <Input color="#ede7e7" placeholder="john.doe@example.com" />
            </Box>

            <Box>
              <Text color="#fff" fontWeight="semibold">Phone</Text>
              <Input color="#ede7e7" placeholder="+1 234 567 8901" />
            </Box>

            <Box>
              <Text color="#fff" fontWeight="semibold">Bio</Text>
              <Textarea color="#ede7e7" placeholder="Short bio about yourself..." />
            </Box>

            <Button color="#fff"
              backgroundColor="#206b8f"
              _hover={{ bg: "#206b8f7a" }} width="full" mt={4}>
              Update Profile
            </Button>
            
          </Stack>
        </Box>
      </Flex>
    </div>
  );
};

export default Userprofile;
