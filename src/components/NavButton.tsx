import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";

type NavButtonProps = {
  color: string;
  text: string;
  icon: React.ElementRef<any>;
  onClick: Function;
};

const NavButton = ({ color, text, icon, onClick }: NavButtonProps) => {
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
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
