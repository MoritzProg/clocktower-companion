import type { Category, Speech } from '../domain/types.ts'

/**
 * Bundled starter content. Hand-editable: add entries here and they will be
 * imported on the next app start (see seed.ts). IDs must stay stable and
 * unique; speeches that are language versions of the same story share a
 * groupId so no playgroup hears a story twice, in any language.
 *
 * Placeholders: $Name for the player, {he|she|they} for gender variants
 * (order: masculine|feminine|neutral; a missing third form falls back to
 * the first).
 */

export const SEED_CATEGORIES: Category[] = [
  { id: 'intro', name: 'Intro & First Night', usesPlayerName: false },
  { id: 'execution', name: 'Execution', usesPlayerName: true },
  { id: 'morning', name: 'Morning & Deaths', usesPlayerName: true },
]

const speech = (
  groupId: string,
  language: 'en' | 'de',
  categoryId: string,
  text: string,
): Speech => ({ id: `${groupId}-${language}`, groupId, categoryId, language, text })

// ---------------------------------------------------------------------------
// Intro & First Night
// ---------------------------------------------------------------------------

const INTROS: Speech[] = [
  speech(
    'intro-two-weeks',
    'en',
    'intro',
    `Two weeks ago, Ravenswood Bluff was a different place entirely. Children played in cobblestone streets lined with flower boxes. Neighbors shared warm bread and warmer smiles. The clocktower chimed gentle hours over a town where doors stayed unlocked and strangers were welcomed with open arms.

Then the first body appeared, and everything changed.

You came then, didn't you? Called yourselves heroes, saviors, demon hunters. But when darkness crept into your perfect little paradise, you crumbled like autumn leaves. Fear... made you suspicious. Rage made you reckless. Pride made you foolish. You turned on each other like rabid dogs, pointing fingers and casting blame until the gallows groaned under the weight of innocent blood.

And while you tore each other apart... they watched. They waited. They smiled.

Now the windows are boarded. The streets echo with whispers instead of laughter. Trust has become a luxury no one can afford, and every shadow holds a memory of your failure.

But here you are again, drawn back like moths to a flame that's already burned you once. Strange... I could have sworn that we buried some of you last time. Oh, and it seems you brought some fresh meat with you — new fools daring to face an enemy they can't even comprehend.

Perhaps this time, you will remember that the greatest danger isn't what lurks in the darkness.`,
  ),
  speech(
    'intro-two-weeks',
    'de',
    'intro',
    `Vor zwei Wochen war Ravenswood Bluff noch ein völlig anderer Ort. Kinder spielten in Gassen voller Blumenkästen, Nachbarn teilten warmes Brot und noch wärmere Worte. Die Turmuhr schlug sanfte Stunden über einer Stadt, in der Türen unverschlossen blieben und Fremde mit offenen Armen empfangen wurden.

Dann fand man die erste Leiche, und alles änderte sich.

Ihr kamt damals, nicht wahr? Nanntet euch Helden, Retter, Dämonenjäger. Doch als die Dunkelheit in euer kleines Paradies kroch, seid ihr zerbrochen wie dürres Laub. Angst... machte euch misstrauisch. Wut machte euch unbesonnen. Stolz machte euch dumm. Ihr seid übereinander hergefallen wie tollwütige Hunde, habt mit Fingern gezeigt und Schuld verteilt, bis der Galgen unter dem Gewicht unschuldigen Blutes ächzte.

Und während ihr euch gegenseitig zerfleischt habt... haben sie zugesehen. Sie haben gewartet. Sie haben gelächelt.

Jetzt sind die Fenster vernagelt. In den Gassen hallt Flüstern statt Lachen. Vertrauen ist ein Luxus, den sich niemand mehr leisten kann, und jeder Schatten birgt eine Erinnerung an euer Versagen.

Und doch seid ihr wieder hier — wie Motten, die zurück in die Flamme fliegen, die sie schon einmal verbrannt hat. Seltsam... ich hätte schwören können, dass wir einige von euch beim letzten Mal begraben haben. Oh, und frisches Fleisch habt ihr auch mitgebracht — neue Narren, die sich einem Feind stellen wollen, den sie nicht einmal begreifen.

Vielleicht erinnert ihr euch diesmal daran: Die größte Gefahr ist nicht das, was in der Dunkelheit lauert.`,
  ),
  speech(
    'intro-twilight',
    'en',
    'intro',
    `You know, there's always been something strange about the twilight hours in Ravenswood Bluff. As the sun begins to dip behind the horizon, shadows begin to stretch like long arms, reaching out for you. Something in the half-light makes you quicken your step as you wend your way home, makes you clutch your children closer as you pass a darkened doorway. Something that sets the dogs growling — at some unseen thing in an alleyway, on the back porch, in the corner of your room.

Something in the half-light that makes your friend's features seem unfamiliar. Is that merely a trick of the light, or is that sickening smile really there? Is there something else looking at you from behind jet-black pupils?

Something about that hour makes you keep close watch on your friends. Straining to hear every whisper, conscious of the acrid smell of sulfur in your nostrils, watching their faces for any sign of — what? Of lies? Of corruption? Of hunger?

So hurry home to bed. Leave a line of salt across the door if you must, carve runes into your bedpost if you need to, clasp your hands and ask a higher power to watch over you in the night. But know this: all of that is just superstition.

The things that hunt in the darkness — they're real.

Good night!`,
  ),
  speech(
    'intro-moon-tag',
    'en',
    'intro',
    `The moon hot-tags the sun as night darkens the doors of Ravenswood Bluff. It's time for you all to go to sleep — and for me to sort the virtuous from the vile.

Good night!`,
  ),
  speech(
    'intro-moon-tag',
    'de',
    'intro',
    `Der Mond klatscht die Sonne ab, und die Nacht verdunkelt die Türen von Ravenswood Bluff. Zeit für euch, schlafen zu gehen — und für mich, die Tugendhaften von den Verdorbenen zu trennen.

Gute Nacht!`,
  ),
  speech(
    'intro-bell-ringer',
    'en',
    'intro',
    `They say the old sexton rang the clocktower bell nine times the night the trouble started — once for every soul the town would lose before it ended. They found him the next morning, hanging from the bell rope, smiling. The bell has rung on its own ever since, and nobody dares climb up to see what pulls the rope.

Tonight, as you gathered in the square, it rang again. You all heard it. You all pretended not to.

Lock your doors, if it comforts you. Count your neighbors while you still can. Somewhere among the faces you've known for years, something else is wearing a borrowed smile — and it has waited, ever so patiently, for the sun to set.

Good night, Ravenswood Bluff. Sleep... if you can.`,
  ),
  speech(
    'intro-fresh-graves',
    'en',
    'intro',
    `Welcome, travelers, to Ravenswood Bluff — you've arrived just in time for the funerals. Oh, don't look so alarmed. We hold them most mornings now. The gravedigger has stopped asking for names; he simply digs, every night, and by dawn the town provides.

You'll find the inn warm, the ale passable, and the townsfolk wonderfully friendly. They'll shake your hand, learn your name, tell you whom to trust — and tonight, by candlelight, one of them will decide whether you see another sunrise.

So eat well. Laugh loudly. Make friends quickly — you will need every one of them, and you will suspect every one of them before this is over.

The sun is setting. The town sleeps. Good night.`,
  ),
  speech(
    'intro-fresh-graves',
    'de',
    'intro',
    `Willkommen, Reisende, in Ravenswood Bluff — ihr kommt gerade rechtzeitig zu den Beerdigungen. Oh, schaut nicht so erschrocken. Wir halten sie inzwischen fast jeden Morgen ab. Der Totengräber fragt schon lange nicht mehr nach Namen; er gräbt einfach, jede Nacht, und bis zum Morgengrauen liefert die Stadt.

Ihr werdet das Gasthaus warm finden, das Bier passabel und die Leute wunderbar freundlich. Sie werden euch die Hand schütteln, sich euren Namen merken, euch sagen, wem ihr vertrauen könnt — und heute Nacht, bei Kerzenlicht, entscheidet einer von ihnen, ob ihr den nächsten Sonnenaufgang noch erlebt.

Also esst gut. Lacht laut. Schließt schnell Freundschaften — ihr werdet jede einzelne brauchen, und ihr werdet jede einzelne verdächtigen, ehe das hier vorbei ist.

Die Sonne geht unter. Die Stadt schläft. Gute Nacht.`,
  ),
  speech(
    'intro-chronik',
    'de',
    'intro',
    `In Ravenswood Bluff führt man seit dreihundert Jahren eine Chronik. Geburten, Hochzeiten, Ernten — und in manchen Jahren, in brauner, verkrusteter Tinte: andere Einträge. Der Chronist von damals schrieb: „Wir haben es begraben. Gott vergebe uns — wir wussten am Ende nicht mehr, wen wir begraben haben."

Heute Abend lag die Chronik aufgeschlagen auf dem Marktplatz. Niemand will sie dorthin gelegt haben. Aufgeschlagen auf einer leeren Seite — und oben, in frischer Tinte, das heutige Datum.

Schlaft gut, Ravenswood Bluff. Die Chronik wartet.

Gute Nacht!`,
  ),
]

// ---------------------------------------------------------------------------
// Execution
// ---------------------------------------------------------------------------

const EXECUTIONS: Speech[] = [
  speech(
    'exec-flee-moon',
    'en',
    'execution',
    `$Name flees because {he is|she is|they are} about to be executed. The escape succeeds, and $Name gets drunk celebrating it. In {his|her|their} drunken state, {he|she|they} {tries|tries|try} to embrace the moon. It was a reflection. $Name drowns.`,
  ),
  speech(
    'exec-flee-moon',
    'de',
    'execution',
    `$Name flieht vor der eigenen Hinrichtung. Die Flucht gelingt, und $Name betrinkt sich vor Freude. Im Rausch versucht {er|sie}, den Mond zu umarmen. Es war eine Spiegelung. $Name ertrinkt.`,
  ),
  speech(
    'exec-pear',
    'en',
    'execution',
    `$Name is to be locked in a room with a hungry bear. However, due to a clerical error, the hungry $Name is locked in a room with a pear. $Name laughs at the mistake and takes a bite of the pear. It was the most poisonous pear in the kingdom, kept as evidence in a murder trial. $Name should have read the warning label. $Name is dead.`,
  ),
  speech(
    'exec-pear',
    'de',
    'execution',
    `$Name soll mit einem hungrigen Bären in eine Zelle gesperrt werden. Durch einen Schreibfehler wird jedoch der hungrige $Name mit einer Birne eingesperrt. $Name lacht über den Irrtum und beißt herzhaft hinein. Es war die giftigste Birne des Königreichs, aufbewahrt als Beweisstück in einem Mordprozess. $Name hätte das Warnschild lesen sollen. $Name ist tot.`,
  ),
  speech(
    'exec-catapult',
    'en',
    'execution',
    `The town, wanting to save rope, decides to execute $Name by catapult. The good news: the catapult misfires. The bad news: it misfires straight up. $Name has a full minute to reflect on {his|her|their} life choices. $Name is dead.`,
  ),
  speech(
    'exec-last-words',
    'en',
    'execution',
    `$Name is granted the traditional last words. Unfortunately, {he|she|they} prepared forty minutes of them. Around minute twelve, the executioner decides that mercy has its limits. $Name is dead.`,
  ),
  speech(
    'exec-last-words',
    'de',
    'execution',
    `Der Tradition folgend werden $Name letzte Worte gewährt. Leider hat {er|sie} vierzig Minuten vorbereitet. Etwa bei Minute zwölf beschließt der Henker, dass auch Gnade ihre Grenzen hat. $Name ist tot.`,
  ),
  speech(
    'exec-volunteer',
    'en',
    'execution',
    `The town can't find an executioner — nobody wants the job. $Name, ever helpful, offers to demonstrate how it's done. $Name turns out to be very good at it. $Name is dead.`,
  ),
  speech(
    'exec-volunteer',
    'de',
    'execution',
    `Die Stadt findet keinen Henker — niemand will den Posten. $Name, stets hilfsbereit, erklärt sich bereit zu zeigen, wie es geht. $Name ist darin wirklich ausgesprochen gut. $Name ist tot.`,
  ),
  speech(
    'exec-cake',
    'en',
    'execution',
    `As a last meal, $Name requests the largest cake the baker has ever made, hoping to buy some time. The plan works beautifully for three hours. Then $Name reaches the file baked into the middle, swallows it whole, and chokes. It was meant for the bars. $Name is dead.`,
  ),
  speech(
    'exec-duck-test',
    'en',
    'execution',
    `The town decides to test whether $Name weighs the same as a duck. The scales are rigged, the duck is furious, and the pond turns out to be much deeper than anyone remembered. $Name is dead. The duck is fine.`,
  ),
  speech(
    'exec-duck-test',
    'de',
    'execution',
    `Die Stadt beschließt zu prüfen, ob $Name genauso viel wiegt wie eine Ente. Die Waage ist manipuliert, die Ente ist wütend, und der Teich ist deutlich tiefer, als sich irgendjemand erinnert hat. $Name ist tot. Der Ente geht es gut.`,
  ),
  speech(
    'exec-rope-shortage',
    'en',
    'execution',
    `Due to the recent surge in executions, the town has run out of rope. The general store offers a discount on anvils instead. Physics does the rest. $Name is dead.`,
  ),
  speech(
    'exec-rope-shortage',
    'de',
    'execution',
    `Wegen der jüngsten Flut an Hinrichtungen ist der Stadt das Seil ausgegangen. Der Krämer bietet stattdessen Ambosse zum Sonderpreis an. Den Rest erledigt die Physik. $Name ist tot.`,
  ),
  speech(
    'exec-appeal',
    'en',
    'execution',
    `$Name appeals the execution, citing a little-known town law from 1683. The judge is impressed. The appeal is granted. Unfortunately, the same law demands trial by lightning storm. The storm is very fair, and very thorough. $Name is dead.`,
  ),
  speech(
    'exec-appeal',
    'de',
    'execution',
    `Gegen das Urteil legt $Name Berufung ein und beruft sich auf ein vergessenes Stadtgesetz von 1683. Der Richter ist beeindruckt. Der Berufung wird stattgegeben. Leider verlangt dasselbe Gesetz ein Gottesurteil durch Gewitter. Das Gewitter ist sehr gerecht und sehr gründlich. $Name ist tot.`,
  ),
  speech(
    'exec-tunnel',
    'en',
    'execution',
    `$Name reveals a secret: for weeks {he|she|they} dug an escape tunnel out of the jail. The whole town gathers to admire it. It truly is a beautiful tunnel — right up to the point where it passes under the river. $Name is dead, but the town gains a lovely new well.`,
  ),
  speech(
    'exec-suppe',
    'de',
    'execution',
    `Als Henkersmahlzeit wünscht sich $Name das Schärfste, was die Taverne zu bieten hat — um dem Tod ins Gesicht zu lachen. Der Koch, von so viel Übermut beleidigt, gibt alles. $Name lacht, hustet, verlangt Wasser. Es gibt kein Wasser. $Name ist tot, und die Suppe wird von der Karte genommen.`,
  ),
]

// ---------------------------------------------------------------------------
// Morning & Deaths
// ---------------------------------------------------------------------------

const MORNINGS: Speech[] = [
  speech(
    'morning-statue',
    'en',
    'morning',
    `As the fog lifts, $Name is found leaning against the tavern wall, painted silver from head to toe, posing as a "living statue". The one catch: living statues usually breathe. The paint, it turns out, was not skin-friendly. $Name is dead.`,
  ),
  speech(
    'morning-statue',
    'de',
    'morning',
    `Als der Nebel weicht, entdeckt man $Name an die Wand der Taverne gelehnt — von Kopf bis Fuß silbern lackiert, posierend als „Lebende Statue". Der einzige Haken: Lebende Statuen atmen normalerweise. Die Farbe war wohl nicht hautverträglich. $Name ist tot.`,
  ),
  speech(
    'morning-well',
    'en',
    'morning',
    `Morning comes, and $Name is discovered in the square's old well, which had been sealed shut with three feet of stone last month. The seal is still intact. The mason swears it's impossible. The priest swears it's demonic. $Name just swears, faintly, from inside the well, before going silent forever. $Name is dead.`,
  ),
  speech(
    'morning-well',
    'de',
    'morning',
    `Der Morgen graut, und man entdeckt $Name im alten Brunnen auf dem Marktplatz — jenem Brunnen, der letzten Monat mit drei Fuß Stein versiegelt wurde. Das Siegel ist unversehrt. Der Maurer schwört, es sei unmöglich. Der Priester schwört, es sei Teufelswerk. $Name flucht nur noch leise aus der Tiefe, dann wird es für immer still. $Name ist tot.`,
  ),
  speech(
    'morning-baker-note',
    'en',
    'morning',
    `The baker finds $Name in the flour cellar, peaceful as a Sunday, holding a half-written note that begins: "I know who it is. It's—". The rest of the note has been eaten. By whom, nobody can say. $Name is dead.`,
  ),
  speech(
    'morning-baker-note',
    'de',
    'morning',
    `In der Backstube ist der Ofen noch warm und das Brot vollkommen. $Name liegt im Mehl, friedlich wie ein Sonntag, mit einem angefangenen Zettel in der Hand: „Ich weiß, wer es ist. Es ist—". Der Rest des Zettels wurde gegessen. Von wem, kann niemand sagen. $Name ist tot.`,
  ),
  speech(
    'morning-sleepwalk',
    'en',
    'morning',
    `$Name always sleepwalked — the family is quick to point that out. But never backwards. Never up the clocktower stairs. And never, the family is very firm on this point, never smiling like that. $Name is dead.`,
  ),
  speech(
    'morning-sleepwalk',
    'de',
    'morning',
    `$Name sei schon immer schlafgewandelt, betont die Familie. Aber nie rückwärts. Nie die Treppe des Uhrturms hinauf. Und niemals — da ist sich die Familie vollkommen einig — niemals mit diesem Lächeln. $Name ist tot.`,
  ),
  speech(
    'morning-garden',
    'en',
    'morning',
    `$Name is found in {his|her|their} garden, where overnight magnificent black roses have grown that the town gardener cannot identify. They smell of copper and honey. Nobody volunteers to prune them. $Name is dead.`,
  ),
  speech(
    'morning-mirror',
    'en',
    'morning',
    `$Name is found sitting before the bedroom mirror, hairbrush still in hand. The reflection shows the room, the chair, the brush. It does not show $Name. The undertaker covers the mirror with a sheet and refuses to explain why. $Name is dead.`,
  ),
  speech(
    'morning-mirror',
    'de',
    'morning',
    `$Name sitzt vor dem Spiegel im Schlafzimmer, die Bürste noch in der Hand. Das Spiegelbild zeigt das Zimmer, den Stuhl, die Bürste. Es zeigt $Name nicht. Der Bestatter hängt ein Tuch über den Spiegel und weigert sich, auch nur ein Wort dazu zu sagen. $Name ist tot.`,
  ),
  speech(
    'morning-chimney',
    'en',
    'morning',
    `$Name is found halfway up the inside of {his|her|their} own chimney. The town agrees {he|she|they} must have been climbing away from something. The town does not agree on what. Whatever it was, it was patient enough to wait at the bottom. $Name is dead.`,
  ),
  speech(
    'morning-tea',
    'en',
    'morning',
    `$Name is found at the kitchen table before a cup of tea that is still steaming — and has been, the neighbors swear, since midnight. Six hours. Nobody dares to drink it. $Name is dead.`,
  ),
  speech(
    'morning-tea',
    'de',
    'morning',
    `$Name sitzt am Küchentisch vor einer Tasse Tee, die noch dampft — und das, schwören die Nachbarn, seit Mitternacht. Sechs Stunden. Niemand traut sich, sie auszutrinken. $Name ist tot.`,
  ),
  speech(
    'morning-thirteen',
    'en',
    'morning',
    `At dawn, the clocktower strikes thirteen. The town counts twice to be sure. Beneath the bell, curled around the clapper like a cat around a warm stove, lies $Name. How {he|she|they} got past the locked tower door remains a mystery — the key is found much later, and much deeper, than anyone would like. $Name is dead.`,
  ),
  speech(
    'morning-scarecrow',
    'en',
    'morning',
    `The farmer swears the scarecrow in the east field wasn't wearing $Name's coat yesterday. Or $Name's boots. Or $Name's face— well. The crows, at least, are finally keeping their distance. $Name is dead.`,
  ),
  speech(
    'morning-scarecrow',
    'de',
    'morning',
    `Der Bauer schwört, die Vogelscheuche im Ostfeld habe gestern noch nicht $Names Mantel getragen. Auch nicht $Names Stiefel. Und schon gar nicht $Names Gesicht— nun ja. Immerhin halten die Krähen endlich Abstand. $Name ist tot.`,
  ),
  speech(
    'morning-glocke',
    'de',
    'morning',
    `Am Morgen fehlt von $Name zunächst jede Spur. Erst beim Mittagsläuten fällt dem Küster auf, wie seltsam dumpf die große Glocke klingt. Man solle sich, sagt er später mit grauem Gesicht, den Klöppel besser nicht genauer ansehen. $Name ist tot.`,
  ),
]

export const SEED_SPEECHES: Speech[] = [...INTROS, ...EXECUTIONS, ...MORNINGS]
