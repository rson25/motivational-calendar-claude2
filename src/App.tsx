import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  Box,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Paper,
  Tooltip,
  Badge,
  Stack,
} from "@mui/material";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import EditIcon from "@mui/icons-material/Edit";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  {
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
  },
  {
    text: "In three words I can sum up everything I've learned about life: it goes on.",
    author: "Robert Frost",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "If you look at what you have in life, you'll always have more.",
    author: "Oprah Winfrey",
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
  {
    text: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair",
  },
  {
    text: "Success is not how high you have climbed, but how you make a positive difference to the world.",
    author: "Roy T. Bennett",
  },
  {
    text: "Don't count the days, make the days count.",
    author: "Muhammad Ali",
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
  },
  {
    text: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
  },
  {
    text: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
  },
  {
    text: "Life is 10% what happens to us and 90% how we react to it.",
    author: "Charles R. Swindoll",
  },
  {
    text: "Strive not to be a success, but rather to be of value.",
    author: "Albert Einstein",
  },
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha",
  },
  { text: "The best revenge is massive success.", author: "Frank Sinatra" },
  {
    text: "I have not failed. I've just found 10,000 ways that won't work.",
    author: "Thomas A. Edison",
  },
  {
    text: "A person who never made a mistake never tried anything new.",
    author: "Albert Einstein",
  },
  {
    text: "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do.",
    author: "Mark Twain",
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
  },
  {
    text: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
  },
  {
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
  },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
  {
    text: "You only live once, but if you do it right, once is enough.",
    author: "Mae West",
  },
  {
    text: "Many of life's failures are people who did not realize how close they were to success when they gave up.",
    author: "Thomas A. Edison",
  },
];

interface DayQuote {
  date: string; // ISO format: YYYY-MM-DD
  quote: Quote;
}

function App() {
  const [name, setName] = useState<string>("");
  const [openNameDialog, setOpenNameDialog] = useState<boolean>(false);
  const [editName, setEditName] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [openQuoteDialog, setOpenQuoteDialog] = useState<boolean>(false);
  const [dayQuotes, setDayQuotes] = useState<DayQuote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isFutureDate, setIsFutureDate] = useState<boolean>(false);

  // Load user name and quotes from localStorage on initial render
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setName(storedName);
    } else {
      setOpenNameDialog(true);
    }

    const storedQuotes = localStorage.getItem("dayQuotes");
    if (storedQuotes) {
      setDayQuotes(JSON.parse(storedQuotes));
    }
  }, []);

  // Save dayQuotes to localStorage whenever it changes
  useEffect(() => {
    if (dayQuotes.length > 0) {
      localStorage.setItem("dayQuotes", JSON.stringify(dayQuotes));
    }
  }, [dayQuotes]);

  const handleNameSubmit = () => {
    if (name.trim()) {
      localStorage.setItem("userName", name);
      setOpenNameDialog(false);
      setEditName(false);
    }
  };

  const handleDateClick = (date: Dayjs) => {
    setSelectedDate(date);

    const now = dayjs();
    const isInFuture = date.isAfter(now, "day");

    setIsFutureDate(isInFuture);

    if (!isInFuture) {
      const dateStr = date.format("YYYY-MM-DD");
      const existingQuote = dayQuotes.find((dq) => dq.date === dateStr);

      if (existingQuote) {
        setCurrentQuote(existingQuote.quote);
      } else {
        // Get a random quote for this day
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setCurrentQuote(randomQuote);

        // Save this quote for this day
        setDayQuotes((prev) => [
          ...prev,
          { date: dateStr, quote: randomQuote },
        ]);
      }
    } else {
      setCurrentQuote(null);
    }

    setOpenQuoteDialog(true);
  };

  const handleCloseQuoteDialog = () => {
    setOpenQuoteDialog(false);
    setSelectedDate(null);
    setCurrentQuote(null);
    setIsFutureDate(false);
  };

  const isDateWithQuote = (date: Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD");
    return dayQuotes.some((dq) => dq.date === dateStr);
  };

  const getQuoteForDate = (date: Dayjs): Quote | undefined => {
    const dateStr = date.format("YYYY-MM-DD");
    const dayQuote = dayQuotes.find((dq) => dq.date === dateStr);
    return dayQuote?.quote;
  };

  const renderDay = (
    day: Dayjs,
    _selectedDays: Dayjs[],
    pickersDayProps: React.HTMLProps<HTMLButtonElement>
  ) => {
    const hasQuote = isDateWithQuote(day);
    const quote = getQuoteForDate(day);

    return (
      <Tooltip title={hasQuote ? quote?.author || "" : ""} arrow>
        <Badge
          overlap="circular"
          badgeContent={hasQuote ? "★" : undefined}
          color="secondary"
        >
          <Box component="div" {...pickersDayProps}>
            {day.date()}
          </Box>
        </Badge>
      </Tooltip>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Typography variant="h3" component="h1" gutterBottom>
                {name
                  ? `${name}'s Motivational Calendar`
                  : "Motivational Calendar"}
              </Typography>
              {name && (
                <IconButton
                  color="primary"
                  onClick={() => {
                    setEditName(true);
                    setOpenNameDialog(true);
                  }}
                  aria-label="edit name"
                >
                  <EditIcon />
                </IconButton>
              )}
            </Stack>

            <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
              <DateCalendar
                value={dayjs()}
                onChange={(date) => date && handleDateClick(date)}
                slots={{
                  day: renderDay as any,
                }}
              />
            </Paper>
          </Box>

          {/* Name Dialog */}
          <Dialog
            open={openNameDialog}
            onClose={() => (editName ? setOpenNameDialog(false) : null)}
          >
            <DialogTitle>
              {editName ? "Edit Your Name" : "Welcome!"}
            </DialogTitle>
            <DialogContent>
              <Typography paragraph>
                {editName
                  ? "Please enter your updated name:"
                  : "Please enter your name to personalize your motivational calendar:"}
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                label="Your Name"
                type="text"
                fullWidth
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              {editName && (
                <Button onClick={() => setOpenNameDialog(false)}>Cancel</Button>
              )}
              <Button
                onClick={handleNameSubmit}
                variant="contained"
                color="primary"
              >
                {editName ? "Update" : "Submit"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Quote Dialog */}
          <Dialog open={openQuoteDialog} onClose={handleCloseQuoteDialog}>
            <DialogTitle>
              {selectedDate
                ? `Quote for ${selectedDate.format("MMMM D, YYYY")}`
                : "Daily Quote"}
            </DialogTitle>
            <DialogContent>
              {isFutureDate ? (
                <Typography paragraph>
                  Please come back tomorrow for your motivational quote of the
                  day!
                </Typography>
              ) : currentQuote ? (
                <>
                  <Typography
                    variant="h6"
                    paragraph
                    sx={{ fontStyle: "italic" }}
                  >
                    "{currentQuote.text}"
                  </Typography>
                  <Typography variant="subtitle1" align="right">
                    — {currentQuote.author}
                  </Typography>
                </>
              ) : null}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseQuoteDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
