'use client';;
import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Stack, useTheme } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

export default function AccordionTransition() {
  const [expanded, setExpanded] = useState(false);

  // Handler for accordion change
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const theme = useTheme();

  return (
    <Box
      sx={{
        '& .MuiAccordion-root': {
          borderColor: theme.palette.divider,
          '& .MuiAccordionSummary-root': {
            bgcolor: 'transparent',
            flexDirection: 'row'
          },
          '& .MuiAccordionDetails-root': {
            borderColor: theme.palette.divider
          },
          '& .Mui-expanded': {
            color: theme.palette.primary.main
          }
        }
      }}
    >
      <Box>
        <Accordion expanded={expanded === `panel1`} onChange={handleChange(`panel1`)} >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel1d-content`} id={`panel1d-header`}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <AutoStoriesIcon></AutoStoriesIcon>
              <Typography variant="h6">Ce documente sunt necesare pentru a aplica pentru o bursă socială la Academia de Studii Economice Bucurest?</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Typography variant="h5">Răspuns: </Typography>
              <Typography>
              Pentru a aplica pentru o bursă socială, studenții trebuie să depună următoarele documente: cerere de bursă socială, adeverință de venituri pentru membrii familiei, certificat de naștere sau carte de identitate pentru toți membrii familiei, adeverință de student și alte documente care să ateste situația socială specifică.</Typography>
             
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === `panel2`} onChange={handleChange(`panel2`)} >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel2d-content`} id={`panel2d-header`}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <AutoStoriesIcon></AutoStoriesIcon>
              <Typography variant="h6">Când se poestează rezultatele pentru burse ?</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Typography variant="h5">Răspuns: </Typography>
              <Typography>
                Postarea rezultatelor se realizeaza la 10 zile lucratoare dupa ce a fost incheiata perioada de aplicare pentru toate bursele aferente.
              </Typography>
              
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === `panel3`} onChange={handleChange(`panel3`)} >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel3d-content`} id={`panel3d-header`}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <AutoStoriesIcon></AutoStoriesIcon>
              <Typography variant="h6">Cum se poate face contestație la rezultatele primite?</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Typography variant="h5">Răspuns: </Typography>
              <Typography>
              Dacă ai primit rezultate la o evaluare și consideri că acestea nu reflectă corect performanța ta, este important să știi că ai dreptul de a face contestație. Procesul de contestație este unul bine reglementat și oferă fiecărui participant posibilitatea de a solicita o reevaluare a lucrărilor sau deciziilor.

Înainte de toate, este crucial să te informezi despre regulile și procedurile specificate de instituția care a organizat evaluarea. Aceste detalii sunt de obicei disponibile în documentele oficiale primite, pe site-ul instituției sau direct în ghidul participantului. Acolo vei găsi informații despre cum și când poți depune o contestație, ce documente trebuie să includeți, și orice taxe asociate.

Odată ce ai adunat toate informațiile necesare, redactează o scrisoare de contestație. Este esențial să abordezi acest demers într-un mod cât se poate de profesional și organizat. În scrisoarea ta, explică clar și concis motivele pentru care crezi că rezultatul primit este incorect. Este important să furnizezi dovezi concrete care să susțină afirmațiile tale, cum ar fi exemple specifice sau erori observate în evaluarea ta. Adaugă orice documentație relevantă care ar putea ajuta la clarificarea situației, precum o copie a lucrării tale, dacă este posibil.

Asigură-te că trimiti contestația înainte de data limită impusă de regulament. Acest termen este adesea strict și depășirea lui poate duce la respingerea automată a contestației tale. 
              </Typography>
         
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === `panel4`} onChange={handleChange(`panel4`)} >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel4d-content`} id={`panel4d-header`}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <AutoStoriesIcon></AutoStoriesIcon>
              <Typography variant="h6">Cum se acordă bursele ?</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Typography variant="h5">Răspuns: </Typography>
              <Typography>
              Bursele de performanță sunt acordate studenților care au obținut rezultate deosebite în competiții naționale și internaționale, olimpiade, conferințe științifice sau alte activități relevante. Se ia în considerare activitatea desfășurată pe parcursul anului universitar precedent.</Typography>
          
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === `panel5`} onChange={handleChange(`panel5`)} >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel5d-content`} id={`panel5d-header`}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <AutoStoriesIcon></AutoStoriesIcon>
              <Typography variant="h6">Există burse speciale pentru studenții care participă la activități extracurriculare?</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Typography variant="h5">Răspuns: </Typography>
              <Typography>
              Da, ASE acordă burse pentru studenții care participă activ la proiecte și evenimente organizate de universitate sau care reprezintă universitatea la nivel național și internațional în diverse domenii culturale, artistice și sportive.
            </Typography>
            </Stack>
          </AccordionDetails>
        </Accordion>
    
    </Box>
    </Box>
  );
}
