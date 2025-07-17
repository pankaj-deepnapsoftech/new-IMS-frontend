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
  Badge,
  Card,
  CardBody,
  CardHeader,
  VStack,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { MdEmail, MdPhone, MdPerson, MdVerifiedUser } from "react-icons/md";
import { colors } from "../theme/colors";

const UserProfile: React.FC = () => {
  const data = useSelector((state: any) => state.auth);

  return (
    <Box
      minH="80vh"
      py={8}
      px={6}
      style={{
        backgroundColor: colors.background.page,
      }}
      className="flex justify-center items-center"  
    >
      <Box maxW="4xl" mx="auto">
        {/* Page Header */}
        <Box mb={8}>
          <Heading size="lg" mb={2} style={{ color: colors.text.primary }}>
            User Profile
          </Heading>
          <Text style={{ color: colors.text.secondary }}>
            Manage your personal information and account settings
          </Text>
        </Box>

        <Flex direction={{ base: "column", lg: "row" }} gap={6}>
          {/* Profile Card */}
          <Card
            style={{
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border.light}`,
              boxShadow: colors.shadow.sm,
            }}
          >
            <CardHeader>
              <Heading size="md" style={{ color: colors.text.primary }}>
                Profile Information
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={6} align="stretch">
                {/* Avatar Section */}
                <Flex direction="column" align="center" py={4}>
                  <Avatar
                    size="2xl"
                    name={`${data.firstname} ${data.lastname}`}
                    src={data.avatarUrl}
                    mb={4}
                    style={{
                      border: `4px solid ${colors.primary[100]}`,
                    }}
                  />
                  <Heading
                    size="lg"
                    style={{ color: colors.text.primary }}
                    textAlign="center"
                  >
                    {data.firstname} {data.lastname}
                  </Heading>
                  <HStack mt={2} spacing={2}>
                    <Badge
                      variant="subtle"
                      style={{
                        backgroundColor: data.isVerified
                          ? colors.success[100]
                          : colors.warning[100],
                        color: data.isVerified
                          ? colors.success[700]
                          : colors.warning[700],
                      }}
                    >
                      <Icon as={MdVerifiedUser} mr={1} />
                      {data.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                    {data.role && (
                      <Badge
                        variant="subtle"
                        style={{
                          backgroundColor: colors.primary[100],
                          color: colors.primary[700],
                        }}
                      >
                        {data.role}
                      </Badge>
                    )}
                  </HStack>
                </Flex>

                <Divider style={{ borderColor: colors.border.light }} />

                {/* Form Fields */}
                <Stack spacing={5}>
                  <Box>
                    <HStack mb={2}>
                      <Icon
                        as={MdPerson}
                        style={{ color: colors.primary[500] }}
                      />
                      <Text
                        fontWeight="semibold"
                        fontSize="sm"
                        style={{ color: colors.text.secondary }}
                      >
                        First Name
                      </Text>
                    </HStack>
                    <Input
                      value={data.firstname || ""}
                      isReadOnly
                      style={{
                        backgroundColor: colors.input.background,
                        borderColor: colors.input.border,
                        color: colors.text.primary,
                      }}
                      _focus={{
                        borderColor: colors.input.borderFocus,
                        boxShadow: `0 0 0 3px ${colors.primary[100]}`,
                      }}
                    />
                  </Box>

                  <Box>
                    <HStack mb={2}>
                      <Icon
                        as={MdPerson}
                        style={{ color: colors.primary[500] }}
                      />
                      <Text
                        fontWeight="semibold"
                        fontSize="sm"
                        style={{ color: colors.text.secondary }}
                      >
                        Last Name
                      </Text>
                    </HStack>
                    <Input
                      value={data.lastname || ""}
                      isReadOnly
                      style={{
                        backgroundColor: colors.input.background,
                        borderColor: colors.input.border,
                        color: colors.text.primary,
                      }}
                      _focus={{
                        borderColor: colors.input.borderFocus,
                        boxShadow: `0 0 0 3px ${colors.primary[100]}`,
                      }}
                    />
                  </Box>

                  <Box>
                    <HStack mb={2}>
                      <Icon
                        as={MdEmail}
                        style={{ color: colors.primary[500] }}
                      />
                      <Text
                        fontWeight="semibold"
                        fontSize="sm"
                        style={{ color: colors.text.secondary }}
                      >
                        Email Address
                      </Text>
                    </HStack>
                    <Input
                      value={data.email || ""}
                      isReadOnly
                      style={{
                        backgroundColor: colors.input.background,
                        borderColor: colors.input.border,
                        color: colors.text.primary,
                      }}
                      _focus={{
                        borderColor: colors.input.borderFocus,
                        boxShadow: `0 0 0 3px ${colors.primary[100]}`,
                      }}
                    />
                  </Box>

                  <Box>
                    <HStack mb={2}>
                      <Icon
                        as={MdPhone}
                        style={{ color: colors.primary[500] }}
                      />
                      <Text
                        fontWeight="semibold"
                        fontSize="sm"
                        style={{ color: colors.text.secondary }}
                      >
                        Phone Number
                      </Text>
                    </HStack>
                    <Input
                      value={data.phone || ""}
                      style={{
                        backgroundColor: colors.input.background,
                        borderColor: colors.input.border,
                        color: colors.text.primary,
                      }}
                      _hover={{ borderColor: colors.input.borderHover }}
                      _focus={{
                        borderColor: colors.input.borderFocus,
                        boxShadow: `0 0 0 3px ${colors.primary[100]}`,
                      }}
                      placeholder="Enter your phone number"
                    />
                  </Box>
                </Stack>

                <Divider style={{ borderColor: colors.border.light }} />

                {/* Action Buttons */}
                <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
                  <Button
                    flex="1"
                    style={{
                      backgroundColor: colors.button.primary,
                      color: colors.text.inverse,
                    }}
                    _hover={{
                      backgroundColor: colors.button.primaryHover,
                    }}
                    _active={{
                      backgroundColor: colors.button.primaryHover,
                    }}
                  >
                    Update Profile
                  </Button>
                  <Button
                    flex="1"
                    variant="outline"
                    style={{
                      borderColor: colors.border.medium,
                      color: colors.text.secondary,
                    }}
                    _hover={{
                      backgroundColor: colors.gray[50],
                      borderColor: colors.border.dark,
                    }}
                  >
                    Change Password
                  </Button>
                </Stack>
              </VStack>
            </CardBody>
          </Card>
        </Flex>
      </Box>
    </Box>
  );
};

export default UserProfile;
