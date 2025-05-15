// @ts-nocheck
import React from "react";
import { Box, Button, HStack, Text, VStack, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const Pagination = ({ page, setPage, TotalPage }) => {
  const goToPrevious = () => setPage((prev) => Math.max(prev - 1, 1));
  const goToNext = () => setPage((prev) => Math.min(prev + 1, TotalPage));

  return (
    <VStack spacing={4} py={6}>
      <HStack spacing={4} align="center" justify="center">
        {/* Previous Button */}
        <IconButton
          aria-label="Previous Page"
          icon={<ChevronLeftIcon />}
          size="sm"
          colorScheme="blue"
          isDisabled={page === 1}
          onClick={goToPrevious}
          variant="solid"
        />

        <Text fontSize="sm" fontWeight="medium" color="gray.200">
          Page <Text as="span" fontWeight="bold" color="white">{page}</Text> of{" "}
          <Text as="span" fontWeight="bold" color="white">{TotalPage}</Text>
        </Text>

        {/* Next Button */}
        <IconButton
          aria-label="Next Page"
          icon={<ChevronRightIcon />}
          size="sm"
          colorScheme="blue"
          isDisabled={page === TotalPage}
          onClick={goToNext}
          variant="solid"
        />
      </HStack>

      {/* Jump-to Buttons (Optional enhancement) */}
      <HStack spacing={1}>
        {Array.from({ length: TotalPage }, (_, i) => (
          <Button
            key={i}
            size="xs"
            onClick={() => setPage(i + 1)}
            bg={page === i + 1 ? "green.500" : "gray.700"}
            color={page === i + 1 ? "white" : "gray.200"}
            _hover={{ bg: "gray.600" }}
            rounded="md"
            fontSize="xs"
          >
            {i + 1}
          </Button>
        ))}
      </HStack>
    </VStack>
  );
};

export default Pagination;
