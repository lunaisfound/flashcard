import { Flashcard } from "react-quizlet-flashcard";
import "react-quizlet-flashcard/dist/index.css";
const MyFlashcard = () => (
  <Flashcard
    front={{ html: <div>Front Content</div> }}
    back={{ html: <div>Back Content</div> }}
  />
);

export default MyFlashcard;
