import React, { use, useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import { getData } from "@/hook/Hook";

const ContactList = (Props) => {
  const [contactByPartner, setContactByPartner] = useState([]);
  console.log(contactByPartner);
  useEffect(() => {
    const getContactByPartner = async () => {
      try {
        const result = await getData(
          `/business-service/contact/byPartner/${Props.selectedContact}`
        );

        setContactByPartner(result);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getContactByPartner();
    console.log("rendering again");
  }, [Props.selectedContact]);
  return (
    <Paper elevation={3} sx={{ overflow: "auto" }}>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {contactByPartner.length > 0 ? (
          contactByPartner.map((contact) => (
            <ListItem key={contact.id} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText
                primary={contact.nameStr}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      <PhoneIcon fontSize="small" sx={{ color: "#1976d2" }} />{" "}
                      {contact.handPhone}
                    </Typography>
                    <br />
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      <EmailIcon fontSize="small" sx={{ color: "#1976d2" }} />{" "}
                      {contact.email}
                    </Typography>
                    <br />
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      <WorkIcon fontSize="small" sx={{ color: "#1976d2" }} />{" "}
                      {contact.title}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))
        ) : (
          <Box sx={{ margin: 2 }}> Không có liên hệ nào</Box>
        )}
      </List>
    </Paper>
  );
};

export default ContactList;
