import React, { createContext, useContext, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button } from '@mui/material';

// Crearea contextului
const DialogContext = createContext();

export const useDialog = () => useContext(DialogContext);

// Componenta provider care gestionează dialogul
export const DialogProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');

    const showDialog = (text) => {
        setContent(text);
        setOpen(true);
    };

    const hideDialog = () => {
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
        <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
        Politică de confidențialitate Prezenta politică de confidențialitate se aplică pentru prelucrarea datelor cu caracter personal
        prin portalul web https://granturi.imm.gov.ro, ce face parte din Sistemul Informatic Integrat pentru înscrierea IMM-urilor
        afectate de impactul economic al pandemiei COVID-19, în vederea accesării de fonduri europene nerambursabile și de alte forme
        de ajutor de stat, denumit în continuare IMM RECOVER, sistem dezvoltat în baza prevederilor Ordonanţa de urgenţă a Guvernului
        nr. 130/2020 privind unele măsuri pentru acordarea de sprijin financiar din fonduri externe nerambursabile, aferente
        Programului operaţional Competitivitate 2014-2020, în contextul crizei provocate de COVID-19, precum şi alte măsuri în
        domeniul fondurilor europene, cu modificările și completările ulterioare. Conform prevederilor OUG nr. 130/2020, cu
        modificările și completările ulterioare, IMM RECOVER se află în administrarea operațională a Ministerului Economiei,
        Antreprenoriatului și Turismului, în calitate de administrator al schemelor de ajutor de stat, și este dezvoltat și
        implementat, din punct de vedere tehnic, de către Serviciul de Telecomunicații Speciale, în conformitate cu cerințele
        operaționale transmise de Ministerul Economiei, Antreprenoriatului și Turismului (MEAT). Având în vedere faptul că prin IMM
        RECOVER se pot administra mai multe scheme de ajutor de stat, precum și măsuri în domeniul fondurilor europene, platforma este
        în prezent utilizată de mai multe instituții și autorități publice din România, în calitate de administratori ai schemelor de
        ajutor de stat. În conformitate cu prevederile următoarelor acte normative, măsurile de ajutor de stat derulate în cadrul MEAT
        sunt prevăzute de: • Ordonanţa de urgenţă a Guvernului nr. 130/2020 privind unele măsuri pentru acordarea de sprijin financiar
        din fonduri externe nerambursabile, aferente Programului operaţional Competitivitate 2014-2020, în contextul crizei provocate
        de COVID-19, precum şi alte măsuri în domeniul fondurilor europene, cu modificările și completările ulterioare; • Ordonanța de
        urgență a Guvernului nr. 224/2020 privind unele măsuri pentru acordarea de sprijin financiar pentru întreprinderile din
        domeniul turismului, alimentației publice și organizării de evenimente, a căror activitate a fost afectată în contextul
        pandemiei de COVID-19, cu modificările și completările ulterioare; • Ordonanța de urgență a Guvernului nr. 61/2022 privind
        unele măsuri pentru acordarea de granturi pentru capital de lucru, entităților din domeniul agroalimentar cu finanțare din
        fonduri externe nerambursabile; • Ordinul nr. 1111/2022 privind aprobarea Procedurii de implementare a Programului pentru
        stimularea, înfiinţării întreprinderilor mici şi mijlocii "Start-up Nation - ROMANIA", în condițiile prevăzute de Ordinul nr.
        1201/382/2022 privind dezvoltarea, administrarea și utilizarea sistemului informatic integrat de gestionare a schemelor de
        ajutor de stat – IMM RECOVER, în vederea implementării programelor naționale de încurajare și de stimulare a înființării
        întreprinderilor mici și mijlocii, precum și în vederea gestionării schemelor de ajutor de stat pentru întreprinderile mici și
        mijlocii. Măsura de ajutor de stat derulată în cadrul Ministerului Energiei: • Ordonanța de urgență a Guvernului nr. 159/2020
        privind finanțarea întreprinderilor mici și mijlocii și domeniului HORECA pentru instalarea sistemelor de panouri fotovoltaice
        pentru producerea de energie electrică cu o putere instalată cuprinsă între 27 kWp și 100 kWp necesară consumului propriu și
        livrarea surplusului în Sistemul energetic național, precum și a stațiilor de reîncărcare de minimum 22 kW pentru vehicule
        electrice și electrice hibrid plug-in, prin Programul de finanțare "ELECTRIC UP", cu modificările și completările ulterioare.
        Măsura derulată în cadrul Ministerului Investițiilor și Proiectelor Europene (MIPE): • Ordonanța de urgență a Guvernului nr.
        25/2022 privind unele măsuri în domeniul fondurilor europene. Măsura derulată prin intermediul Ministerului Agriculturii și
        Dezvoltării Rurale: • Ordonanța de urgență a Guvernului nr. 61/2022 privind unele măsuri pentru acordarea de microgranturi,
        entităților din domeniul agroalimentar cu finanțare din fonduri externe nerambursabile. Toate activitățile de prelucrare a
        datelor cu caracter personal desfășurate în cadrul sau în legătură cu portalul web https://granturi.imm.gov.ro sunt în acord
        cu prevederile Regulamentului (UE) 2016/679 privind protecția persoanelor fizice în ceea ce privește prelucrarea datelor cu
        caracter personal și privind libera circulație a acestor date și de abrogare a Directivei 95/46/CE (Regulamentul general
        privind protecția datelor) și cu Legea nr. 190/2018 privind măsuri de punere în aplicare a Regulamentului (UE) 2016/679 al
        Parlamentului European și al Consiliului din 27 aprilie 2016 privind protecția persoanelor fizice în ceea ce privește
        prelucrarea datelor cu caracter personal și privind libera circulație a acestor date și de abrogare a Directivei 95/46/CE
        (Regulamentul general privind protecția datelor). Termeni și definiții Date cu caracter personal – orice informații privind o
        persoană fizică, identificată sau identificabilă, (“persoana vizată”) direct sau indirect, în special prin referire la un
        element de identificare, cum ar fi un nume, un număr de identificare, date de localizare, un identificator online, sau la unul
        sau mai multe elemente specifice, proprii identității sale fizice, fiziologice, genetice, psihice, economice, culturale sau
        sociale. Prelucrare – orice operațiune sau set de operațiuni efectuate asupra datelor cu caracter personal sau asupra
        seturilor de date cu caracter personal, cu sau fără utilizarea de mijloace automatizate, cum ar fi colectarea, înregistrarea,
        organizarea, structurarea, stocarea, adaptarea sau modificarea, extragerea, consultarea, utilizarea, divulgarea prin
        transmiterea, diseminarea sau punerea la dispoziție în orice alt mod, alinierea sau combinarea, restricționarea, ștergerea sau
        distrugerea. Consimțământ – orice manifestare de voință liberă, specifică, informată și lipsită de ambiguitate a
        utilizatorului prin care acesta acceptă, printr-o declarație sau printr-o acțiune fără echivoc, ca datele cu caracter personal
        care îl privesc să fie prelucrate. Cookie – Un „Internet Cookie” (termen cunoscut și ca „browser cookie” sau „HTTP cookie” sau
        pur și simplu „cookie”) este un fișier de mici dimensiuni, format din litere și numere, care va fi stocat pe computerul,
        terminalul mobil sau alte echipamente ale unui utilizator de pe care se accesează Internetul. Cookie-ul este instalat prin
        solicitarea emisă de către un web-server unui browser (ex: Internet Explorer, Chrome) și este complet „pasiv” (nu conține
        programe software, viruși sau spyware și nu poate accesa informațiile de pe hard-disk-ul utilizatorului). Un cookie este
        format din 2 părți: numele și conținutul sau valoarea cookie-ului. Mai mult, durata de existență a unui cookie este
        determinată tehnic, doar webserver-ul care a trimis cookie-ul îl poate accesa din nou în momentul în care un utilizator se
        întoarce pe website-ul asociat webserver-ului respectiv. Operator – înseamnă persoana fizică sau juridică, autoritatea
        publică, agenţia sau alt organism care, singur sau împreună cu altele, stabileşte scopurile şi mijloacele de prelucrare a
        datelor cu caracter personal. Operatori asociați - În cazul în care doi sau mai mulţi operatori stabilesc în comun scopurile
        şi mijloacele de prelucrare, aceştia sunt operatori asociaţi. Ei stabilesc într-un mod transparent responsabilităţile
        fiecăruia în ceea ce priveşte îndeplinirea obligaţiilor care le revin în temeiul RGPD, în special în ceea ce priveşte
        exercitarea drepturilor persoanelor vizate şi îndatoririle fiecăruia de furnizare a informaţiilor prevăzute la articolele 13
        şi 14, prin intermediul unui acord între ei, cu excepţia cazului şi în măsura în care responsabilităţile operatorilor sunt
        stabilite în dreptul Uniunii sau în dreptul intern care se aplică acestora. Utilizator – persoana fizică, cetățean român sau
        străin, care își exprimă consimțământul pentru accesarea portalului web granturi.imm.gov.ro, conform politicilor operatorului.
        Autoritate de supraveghere – "autoritate de supraveghere" înseamnă o autoritate publică independentă instituită de un stat
        membru în temeiul articolului 51 din RGPD; În România - Autoritatea Națională de Supraveghere a Prelucrării Datelor cu
        Caracter Personal (ANSPDCP). Principii conform art. 5 din Regulamentul general privind protecția datelor cu caracter personal
        Politica de confidențialitate se întemeiază pe următoarele principii: 1. Prelucrarea datelor cu caracter personal se
        realizează în mod legal, echitabil și transparent. 2. Colectarea datelor cu caracter personal se face în scopuri determinate,
        explicite și legitime, acestea nefiind prelucrate ulterior într-un mod incompatibil cu aceste scopuri. 3. Datele cu caracter
        personal sunt adecvate, relevante și limitate la ceea ce este necesar în raport cu scopurile în care sunt prelucrate. 4.
        Datele cu caracter personal sunt riguros exacte și se actualizează în cazul în care este necesar. 5. Datele cu caracter
        personal sunt păstrate într-o formă care permite identificarea numai pentru perioada necesară îndeplinirii scopurilor în care
        sunt prelucrate datele. 6. Prelucrarea se realizează într-un mod care asigură securitatea adecvată a datelor cu caracter
        personal, inclusiv protecția împotriva prelucrării neautorizate sau ilegale și împotriva pierderii, a distrugerii sau a
        deteriorării accidentale, prin luarea de măsuri tehnice sau organizatorice corespunzătoare. Datele cu caracter personal
        prelucrate prin portalul web granturi.imm.gov.ro și temeiul juridic al prelucrării datelor cu caracter personal Prin
        intermediul portalului web https://granturi.imm.gov.ro sunt prelucrate date cu caracter personal completate de către
        utilizatori, în vederea: a) creării contului de utilizator în sistemul informatic; b) validării identității solicitantului de
        finanțare; c) validării calității de reprezentant al persoanei juridice pentru care se solicită finanțare; d) desfășurării
        activităţilor aferente implementării proiectelor depuse (lansare apeluri de proiecte, depunere aplicaţii, evaluare,
        contractare şi implementare). Datele cu caracter personal prelucrate prin intermediul https://granturi.imm.gov.ro sunt, după
        caz, următoarele: nume, prenume, codul numeric personal, seria și numărul actului de identitate, adresa de domiciliu, date
        privind raporturile de muncă, numărul de telefon, adresa de e-mail, date privind situația financiară, date bancare. Datele cu
        caracter personal colectate prin https://granturi.imm.gov.ro se prelucrează în temeiul art. 6 din RGPD – Legalitatea
        prelucrării, alin. (1) literele: (c) prelucrarea este necesară în vederea îndeplinirii unei obligații legale care îi revine
        operatorului; (e) prelucrarea este necesară pentru îndeplinirea unei sarcini care servește unui interes public sau care
        rezultă din exercitarea autorității publice cu care este învestit operatorul; Durata de prelucrare, și implicit de stocare, a
        datelor cu caracter personal este pe toată durata desfășurării activităţilor aferente implementării schemelor de ajutor de
        stat, precum și a activităților asociate activității de accesare fonduri europene nerambursabile, în conformitate cu
        legislația în vigoare în domeniul fondurilor europene cât și a legislației naționale. Măsuri de securitate implementate
        Măsurile de securitate a datelor cu caracter personal prelucrate prin intermediul portalului web granturi.imm.gov.ro sunt
        asigurate în conformitate cu prevederile art. 32 din RGPD – Securitatea prelucrării. Suntem preocupați permanent de
        implementarea măsurilor de securitate ce se impun pentru a reduce la minimum riscurile de acces neautorizat la date și
        implicit impactul asupra vieții private a utilizatorilor. Drepturile utilizatorului Drepturile conferite de Regulamentul UE
        nr. 2016/679 pot fi exercitate după cum urmează: • dreptul de informare și acces la date cu caracter personal, în temeiul
        căruia se poate obține o confirmare din partea operatorului de date că sunt prelucrate sau nu date cu caracter personal, având
        acces la datele respective și la informații privind modalitățile și scopurile prelucrării acestora. Modificarea politicii de
        prelucrare a datelor cu caracter personal Prezenta politică de prelucrare a datelor cu caracter personal poate fi actualizată
        ca urmare a modificării legislației relevante în domeniu sau a schimbărilor intervenite în structura și funcțiile IMM RECOVER
        sau ale portalului web https://granturi.imm.gov.ro, în conformitate cu cerințele operaționale furnizate de Ministerul
        Economiei, Antreprenoriatului și Turismului În cazul în care se fac modificări ale politicii de prelucrare a datelor cu
        caracter personal, utilizatorii vor fi înștiințați prin afișarea pe portalul web https://granturi.imm.gov.ro a unui mesaj de
        informare, în acest sens, înainte ca schimbările să intre în vigoare. Încurajăm utilizatorii să verifice portalul web
        https://granturi.imm.gov.ro periodic pentru a fi informați despre ultimele noutăți în ceea ce privește practicile noastre de
        prelucrare a datelor cu caracter personal. Cum ne poți contacta? Pentru nelămuriri sau întrebări în legătură cu prelucrarea
        datelor cu caracter personal, vă puteți adresa cu cerere scrisă către Ministerul Economiei, Antreprenoriatului și Turismului,
        Calea Victoriei, nr. 152, Sector 1, București, în cazul în care persoana vizată solicită date sau informații cu privire la
        prelucrarea datelor cu caracter personal într-o schemă de ajutor de stat administrată de MEAT conform cu OUG nr. 130/2020 cu
        modificările și completările ulterioare, OUG 224/2020 cu modificările și completările ulterioare, OUG nr. 61/2022 și Ordinul
        nr. 1111/2022. De asemenea, având în vedere faptul că OUG nr. 61/2022 se derulează și în cadrul Ministerului Agriculturii și
        Dezvoltării Rurale pentru măsura privind microgranturi acordate entităților din domeniul agroalimentar, solicitările vor fi
        adresate la adresa de e-mail: relatii.publice@madr.ro În cazul schemei de ajutor de stat derulată prin intermediul MIPE –
        conform OUG nr. 25/2022 la adresa de e-mail: contact.minister@mfe.gov.ro În cazul schemei de ajutor de stat derulată prin
        intermediul Ministerului Energiei conform OUG nr. 159/2020 la adresa de e-mail: comunicare@energie.gov.ro. În situația în care
        solicitările privind datele cu caracter personal, vor fi adresate Ministerului Economiei, Antreprenoriatului și Turismului,
        pentru o măsură ce se derulează în cadrul altei instituții/ autorități publice, cererea persoanei vizate va fi înaintată către
        instituția/ autoritatea publică în cauză. În cazul în care doriți să formulați plângeri privind prelucrarea datelor cu
        caracter personal, ne puteți scrie la aceeași adresă, urmând să vă răspundem în termenul legal de corespondență, în acord cu
        politicile și procedurile noastre interne. În cazul în care considerați că v-au fost încălcate drepturile privind prelucrarea
        datelor cu caracter personal și Ministerul Economiei, Antreprenoriatului și Turismului/altă instituție/autoritate publică prin
        intermediul căreia se derulează una din schemele de ajutor de stat prevăzută de OUG nr. 130/2020, cu modificările și
        completările ulterioare, OUG nr. 159/2020, cu modificările și completările ulterioare, OUG nr. 224/2020, cu modificările și
        completările ulterioare, OUG nr. 25/2022, OUG nr. 61/2022, Ordinul nr. 1111/2022 nu a tratat plângerea în mod corespunzător,
        vă puteți adresa autorității de supraveghere a prelucrării datelor cu caracter personal. Autoritatea Națională de Supraveghere
        a Prelucrării Datelor cu Caracter Personal din România are sediul în București, bd. Gen. Gheorghe Magheru nr. 28 – 30,
        sectorul 1, cod poștal 010336.
      </DialogContentText>
    );
};
