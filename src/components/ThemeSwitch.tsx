import React from "react";
import { Switch, useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectAppState, setDarkMode } from "../features/appStateSlice";

const label = { inputProps: { "aria-label": "Switch Theme" } };

const ThemeSwitch: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector(selectAppState);

  const toggleTheme = () => {
    dispatch(setDarkMode(!darkMode));
  };

  return (
    <Switch
      sx={{
        padding: 0,
        mr: 2,
        width: "72px",
        height: "36px",
        "& .MuiSwitch-switchBase": {
          pt: 0,
          pb: 0,
          pr: 0,
          pl: 0,
          margin: "2px !important",
        },
        "& .Mui-checked": {
          pt: 0,
          pb: 0,
          pr: 2,
          pl: 2,
        },

        "& .MuiSwitch-track": {
          borderRadius: 22 / 2,
          opacity: "1 !important",
          backgroundColor: theme.palette.primary.main,
          "&:before, &:after": {
            content: '""',
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: 16,
            height: 16,
          },
          "&:before": {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M24 16.5705C22.1678 17.789 19.9572 18.5007 17.5772 18.5007C11.2462 18.5007 6.11388 13.464 6.11388 7.25091C6.11388 4.48822 7.12864 1.95812 8.81232 0C3.70854 1.54602 0 6.21227 0 11.7286C0 18.5065 5.59889 24.0011 12.5055 24.0011C17.6599 24.0011 22.086 20.9407 24 16.5705Z" fill="%23FFD809"/> <path d="M15.7254 0.249256C15.6929 0.162964 15.5708 0.162964 15.5383 0.249256L14.8037 2.19754C14.7934 2.22484 14.7717 2.24629 14.7442 2.25625L12.7643 2.97524C12.6765 3.00713 12.6765 3.13133 12.7643 3.16323L14.7442 3.88221C14.7717 3.89217 14.7934 3.91362 14.8037 3.94093L15.5383 5.88921C15.5708 5.9755 15.6929 5.9755 15.7254 5.88921L16.46 3.94093C16.4703 3.91362 16.492 3.89217 16.5195 3.88221L18.4994 3.16323C18.5872 3.13133 18.5872 3.00713 18.4994 2.97524L16.5195 2.25625C16.492 2.24629 16.4703 2.22484 16.46 2.19754L15.7254 0.249256Z" fill="%23FFD809"/> <path d="M20.936 6.38555C20.9035 6.29926 20.7814 6.29926 20.7489 6.38555L20.0143 8.33383C20.004 8.36113 19.9823 8.38258 19.9548 8.39254L17.9749 9.11153C17.8871 9.14342 17.8871 9.26763 17.9749 9.29952L19.9548 10.0185C19.9823 10.0285 20.004 10.0499 20.0143 10.0772L20.7489 12.0255C20.7814 12.1118 20.9035 12.1118 20.936 12.0255L21.6706 10.0772C21.6809 10.0499 21.7026 10.0285 21.7301 10.0185L23.71 9.29952C23.7978 9.26763 23.7978 9.14342 23.71 9.11153L21.7301 8.39254C21.7026 8.38258 21.6809 8.36113 21.6706 8.33383L20.936 6.38555Z" fill="%23FFD809"/> </svg>')`,
            left: 12,
          },
          "&:after": {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12.2" r="5" fill="%23FF8855"/> <rect y="11.2" width="4" height="1.6" rx="0.8" fill="%23FF8855"/> <rect x="20" y="11.2" width="4" height="1.6" rx="0.8" fill="%23FF8855"/> <rect x="11.2" y="24" width="4" height="1.6" rx="0.8" transform="rotate(-90 11.2 24)" fill="%23FF8855"/> <rect x="11.2" y="4" width="4" height="1.6" rx="0.8" transform="rotate(-90 11.2 4)" fill="%23FF8855"/> <rect x="2.94904" y="19.9197" width="4" height="1.6" rx="0.8" transform="rotate(-45 2.94904 19.9197)" fill="%23FF8855"/> <rect x="17.0912" y="5.77759" width="4" height="1.6" rx="0.8" transform="rotate(-45 17.0912 5.77759)" fill="%23FF8855"/> <rect x="4.08038" y="2.94897" width="4" height="1.6" rx="0.8" transform="rotate(45 4.08038 2.94897)" fill="%23FF8855"/> <rect x="18.2225" y="17.0911" width="4" height="1.6" rx="0.8" transform="rotate(45 18.2225 17.0911)" fill="%23FF8855"/> </svg> ')`,
            right: 12,
          },
        },
        "& .MuiSwitch-thumb": {
          background: "#FFF",
          width: 32,
          height: 32,
        },
      }}
      {...label}
      checked={darkMode}
      onChange={toggleTheme}
    />
  );
};

export default ThemeSwitch;
