'use client';

// material-ui
import { Grid } from '@mui/material';

// project imports
import MainCard from '../components/MainCard';
import ActiveTickets from '../sections/widget/data/ActiveTickets';
import { Typography } from '../../node_modules/@mui/material/index';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InfoIcon from '@mui/icons-material/Info';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';

// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <MainCard title="Anunțuri" shadow="22">
      <Grid sx={{ mb: 2 }}>
        <React.Fragment>
          <Button onClick={handleClickOpen('paper')} variant="outlined">
            <ReportGmailerrorredIcon></ReportGmailerrorredIcon> GDPR
          </Button>

          <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            sx={{ mb: 2, mt: 2 }}
          >
            <DialogTitle id="scroll-dialog-title">
              <InfoIcon></InfoIcon> GDPR
            </DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
              <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
                <Grid>
                  {' '}
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    {' '}
                    LEGE nr. 363 din 28 decembrie 2018 privind protecţia persoanelor fizice referitor la prelucrarea datelor cu caracter
                    personal de către autorităţile competente în scopul prevenirii, descoperirii, cercetării, urmăririi penale şi combaterii
                    infracţiunilor sau al executării pedepselor, măsurilor educative şi de siguranţă, precum şi privind libera circulaţie a
                    acestor date
                  </Typography>
                  <Typography variant="h2" sx={{ mb: 2, mt: 2 }}>
                    Parlamentul României adoptă prezenta lege
                  </Typography>
                  <Typography variant="h6">
                    Art. 1 (1)Prezenta lege reglementează prelucrarea datelor cu caracter personal în scopul realizării activităţilor de
                    prevenire, descoperire, cercetare, urmărire penală şi combatere a infracţiunilor, de executare a pedepselor, măsurilor
                    educative şi de siguranţă, precum şi de menţinere şi asigurare a ordinii şi siguranţei publice de către autorităţile
                    competente, în limitele competenţelor stabilite prin lege. (2)Prelucrarea datelor cu caracter personal pentru realizarea
                    activităţilor de menţinere şi asigurare a ordinii şi siguranţei publice se realizează numai dacă acestea sunt prevăzute
                    de lege şi sunt necesare pentru prevenirea unui pericol cel puţin asupra vieţii, integrităţii corporale sau sănătăţii
                    unei persoane ori a proprietăţii acesteia, precum şi pentru combaterea infracţiunilor. Art. 2 (1)Prezenta lege are ca
                    scop protejarea drepturilor şi libertăţilor fundamentale ale persoanelor fizice, în special a dreptului la protecţia
                    datelor cu caracter personal. (2)Prezenta lege stabileşte condiţiile în care se realizează libera circulaţie a datelor
                    cu caracter personal în scopul realizării activităţilor prevăzute la art. 1. (3)Libera circulaţie a datelor cu caracter
                    personal pe teritoriul naţional sau în relaţia cu statele membre ale Uniunii Europene, circumscrisă realizării
                    activităţilor prevăzute la art. 1, nu poate fi împiedicată din motive legate de protecţia persoanei faţă de prelucrările
                    de date cu caracter personal atât timp cât condiţiile din prezenta lege sau, după caz, din Regulamentul UE 2016/679 al
                    Parlamentului European şi al Consiliului din 27 aprilie 2016 privind protecţia persoanelor fizice în ceea ce priveşte
                    prelucrarea datelor cu caracter personal şi privind libera circulaţie a acestor date şi de abrogare a Directivei
                    95/46/CE (Regulamentul general privind protecţia datelor), denumit în continuare Regulamentul general privind protecţia
                    datelor, ori din legislaţia naţională de punere în aplicare a acestuia sunt îndeplinite. Art. 3 (1)Prezenta lege se
                    aplică prelucrării datelor cu caracter personal de către autorităţile competente în scopurile prevăzute la art. 1.
                    (2)Prezenta lege se aplică prelucrării datelor cu caracter personal realizate integral sau parţial prin mijloace
                    automatizate, precum şi prelucrării, prin alte mijloace decât cele automatizate, a datelor cu caracter personal care fac
                    parte dintr-un sistem de evidenţă a datelor sau care sunt destinate să fie incluse într-un asemenea sistem. (3)Prezenta
                    lege nu se aplică prelucrărilor de date cu caracter personal efectuate pentru realizarea activităţilor din domeniul
                    apărării naţionale şi securităţii naţionale, în limitele şi cu restricţiile stabilite prin legislaţia în materie. Art. 4
                    În sensul prezentei legi, termenii şi expresiile de mai jos au următoarele semnificaţii: a)date cu caracter personal -
                    orice informaţii privind o persoană fizică identificată sau identificabilă, denumită în continuare persoană vizată; o
                    persoană fizică identificabilă este o persoană care poate fi identificată, direct sau indirect, în special prin referire
                    la un element de identificare, cum ar fi un nume, un număr de identificare, date de localizare, un identificator online,
                    sau la unul sau mai multe elemente specifice proprii identităţii sale fizice, fiziologice, genetice, psihice, economice,
                    culturale sau sociale; b)prelucrare - orice operaţiune sau set de operaţiuni efectuate asupra datelor cu caracter
                    personal sau seturilor de date cu caracter personal, cu sau fără utilizarea de mijloace automatizate, cum ar fi
                    colectarea, înregistrarea, organizarea, structurarea, stocarea, adaptarea sau modificarea, extragerea, consultarea,
                    utilizarea, dezvăluirea prin transmitere, diseminarea sau punerea la dispoziţie în orice alt mod, alinierea sau
                    combinarea, restricţionarea, ştergerea sau distrugerea; c)restricţionarea prelucrării - marcarea datelor cu caracter
                    personal stocate, cu scopul de a limita prelucrarea viitoare a acestora; d)creare de profiluri - orice formă de
                    prelucrare automată a datelor cu caracter personal care constă în utilizarea datelor cu caracter personal pentru a
                    evalua anumite aspecte personale referitoare la o persoană fizică, în special pentru a analiza sau a preconiza aspecte
                    privind performanţa la locul de muncă, situaţia economică, sănătatea, preferinţele personale, interesele,
                    corectitudinea, comportamentul, localizarea sau deplasările respectivei persoane fizice; e)pseudonimizare - prelucrarea
                    datelor cu caracter personal într-un asemenea mod încât acestea să nu mai poată fi atribuite unei anume persoane vizate
                    fără a se utiliza informaţii suplimentare, în măsura în care aceste informaţii suplimentare sunt stocate separat şi fac
                    obiectul unor măsuri de natură tehnică şi organizatorică destinate să garanteze neatribuirea unei persoane fizice
                    identificate sau identificabile; f)sistem de evidenţă a datelor - orice set structurat de date cu caracter personal
                    accesibile conform unor criterii specifice, fie ele centralizate, descentralizate sau repartizate după criterii
                    funcţionale sau geografice; g)autoritate competentă - orice autoritate publică sau orice alt organism sau entitate
                    învestită cu exerciţiul autorităţii de stat, competentă în materie de prevenire, descoperire, cercetare, urmărire penală
                    şi combatere a infracţiunilor sau de executare a pedepselor, inclusiv în materia menţinerii şi asigurării ordinii şi
                    siguranţei publice; h)operator - autoritatea competentă care, singură sau împreună cu altele, stabileşte scopurile şi
                    mijloacele de prelucrare a datelor cu caracter personal; atunci când scopurile şi mijloacele de prelucrare sunt
                    stabilite printr-un act normativ, operatorul sau criteriile specifice pentru determinarea acestuia se stabilesc prin
                    actul normativ de referinţă; i)persoană împuternicită de către operator - persoana fizică sau juridică,
                    instituţia/autoritatea publică, agenţia sau alt organism care prelucrează datele cu caracter personal în numele
                    operatorului; j)destinatar - persoana fizică sau juridică, instituţia/autoritatea publică, agenţia sau un alt organism
                    căruia îi sunt transmise datele cu caracter personal, fie că aceasta este sau nu o parte terţă; sunt exceptate din
                    înţelesul definiţiei autorităţile competente care pot primi date cu caracter personal în cadrul unei anchete, în
                    conformitate cu legislaţia aplicabilă, iar prelucrarea datelor cu caracter personal respective de către acestea respectă
                    normele aplicabile în materie de protecţie a datelor în conformitate cu scopurile prelucrării; k)încălcarea securităţii
                    datelor cu caracter personal - orice eveniment, acţiune sau inacţiune ce poate provoca o încălcare a securităţii, care
                    duce, în mod accidental sau ilegal, la distrugerea, pierderea, modificarea, divulgarea neautorizată sau accesul
                    neautorizat la datele cu caracter personal transmise, stocate sau prelucrate în alt mod; l)date genetice - datele cu
                    caracter personal referitoare la caracteristicile genetice moştenite sau dobândite ale unei persoane fizice, care oferă
                    informaţii unice privind fiziologia sau sănătatea respectivei persoane fizice, astfel cum rezultă în special în urma
                    unei analize a unei mostre de material biologic recoltate de la acea persoană fizică; m)date biometrice - date cu
                    caracter personal care rezultă în urma unor tehnici de prelucrare specifice, referitoare la caracteristicile fizice,
                    fiziologice sau comportamentale ale unei persoane fizice, care permit sau confirmă identificarea unică a respectivei
                    persoane fizice, cum ar fi imaginile faciale sau datele dactiloscopice; n)date privind sănătatea - date cu caracter
                    personal legate de sănătatea fizică sau mentală a unei persoane fizice, inclusiv acordarea de servicii de asistenţă
                    medicală, care dezvăluie informaţii despre starea de sănătate a acesteia; o)autoritate de supraveghere - Autoritatea
                    Naţională de Supraveghere a Prelucrării Datelor cu Caracter Personal, desemnată potrivit Legii nr. 102/2005 privind
                    înfiinţarea, organizarea şi funcţionarea Autorităţii Naţionale de Supraveghere a Prelucrării Datelor cu Caracter
                    Personal, cu modificările şi completările ulterioare; p)organizaţie internaţională - o organizaţie şi organismele sale
                    subordonate reglementate de dreptul internaţional public sau orice alt organism care este instituit printr-un acord
                    încheiat între două sau mai multe state sau în temeiul unui astfel de acord; q)interoperabilizare - operaţiunea de a
                    pune în legătură datele cu caracter personal cuprinse într-un fişier, într-o bază de date sau într-un sistem de evidenţă
                    automat cu cele cuprinse într-unul sau mai multe fişiere, baze de date sau sisteme de evidenţă automate care sunt
                    gestionate de operatori diferiţi sau de către acelaşi operator, dar având scopuri diferite, similare sau corelate, după
                    caz; r)evidenţă pasivă - fişier sau bază de date cu caracter personal constituită în scopul accesării limitate şi
                    ulterior ştergerii datelor stocate din sistemul de evidenţă; s)stat membru - orice stat membru al Uniunii Europene;
                    ş)plan de remediere - anexă la procesul-verbal de constatare şi sancţionare a contravenţiei, întocmit în condiţiile
                    prevăzute la art. 62, prin care Autoritatea Naţională de Supraveghere a Prelucrării Datelor cu Caracter Personal
                    stabileşte măsuri şi un termen de remediere; t)măsură de remediere - soluţie dispusă de Autoritatea Naţională de
                    Supraveghere a Prelucrării Datelor cu Caracter Personal în planul de remediere în vederea îndeplinirii de către operator
                    sau de către persoana împuternicită de acesta a obligaţiilor prevăzute de lege; ţ)termen de remediere - perioada de timp
                    cuprinsă între 60 şi 180 de zile de la data comunicării procesului-verbal de constatare şi sancţionare a contravenţiei,
                    în care operatorul sau persoana împuternicită de acesta are posibilitatea remedierii neregulilor constatate şi
                    îndeplinirii obligaţiilor legale.{' '}
                  </Typography>
                </Grid>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>închide</Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <ActiveTickets />
        </Grid>
      </Grid>
    </MainCard>
  );
};
export default SamplePage;
