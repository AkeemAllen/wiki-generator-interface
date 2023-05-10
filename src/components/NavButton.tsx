import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { ReactNode } from "react";

type NavButtonProps = {
  color: string;
  text: string;
  icon: ReactNode;
  onClick: () => void;
  isActive?: boolean;
};

const NavButton = ({
  color,
  text,
  icon,
  onClick,
  isActive = false,
}: NavButtonProps) => {
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        backgroundColor: isActive ? theme.colors.blue[0] : "transparent",
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor: isActive
            ? theme.colors.blue[0]
            : theme.colors.gray[0],
        },
      })}
      onClick={onClick}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{text}</Text>
      </Group>
    </UnstyledButton>
  );
};

export default NavButton;
