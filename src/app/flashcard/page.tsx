"use client";

import Flashcards, { FlashcardsContent } from "@/components/Flashcards";
import PrefetchTranscripts from "@/components/PrefetchTranscripts";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

// универсальный хелпер: проверка, что у объекта есть строковое поле K
function hasString<K extends string>(
  obj: unknown,
  key: K
): obj is Record<K, string> {
  return (
    !!obj &&
    typeof obj === "object" &&
    typeof (obj as Record<K, unknown>)[key] === "string"
  );
}

// type guard для аудио-карточек (без any)
function isAudioCard(
  c: FlashcardsContent
): c is FlashcardsContent & { type: "audio"; audioUrl: string } {
  return c.type === "audio" && hasString(c, "audioUrl");
}

export default function FlashcardPage() {
  const router = useRouter();

  // Делаем массив карточек стабильным (одна и та же ссылка между рендерами)
  const flashcards = useMemo<FlashcardsContent[]>(
    () => [
      {
        id: "f1",
        type: "audio",
        title: "Rebuilding after a confidence dip Part 1",
        content: "",
        audioUrl: "/audio-1.m4a",
        backgroundImage: "/video-bg.png",
      },
      {
        id: "f2",
        type: "audio",
        title: "Rebuilding after a confidence dip Part 2",
        content: "",
        audioUrl: "/audio-2.m4a",
        backgroundImage: "/video-bg.png",
      },
      {
        id: "f3",
        type: "audio",
        title: "Rebuilding after a confidence dip Part 3",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
        audioUrl: "/audio-3.m4a",
        backgroundImage: "/video-bg.png",
      },
      {
        id: "f4",
        type: "input",
        title: "What kind of pressure have you been feeling recently? ",
        content:
          "How has it affected your decisions, your energy, or your execution?'",
        backgroundImage: "/video-bg.png",
      },
    ],
    []
  );

  // Инициализируем фон сразу из первой карточки — без useEffect
  const [currentBgImage, setCurrentBgImage] = useState<string>(
    flashcards[0]?.backgroundImage || "/video-bg.png"
  );

  const handleSlideChange = (index: number) => {
    const newBg = flashcards[index]?.backgroundImage || "/video-bg.png";
    setCurrentBgImage(newBg);
  };

  const handleComplete = () => {
    router.push("/modal-finish");
  };

  // Без any: фильтруем type-guard'ом и берём .audioUrl
  const audioUrls = useMemo(
    () => flashcards.filter(isAudioCard).map((c) => c.audioUrl),
    [flashcards]
  );

  return (
    <div className='w-full h-full flex justify-center'>
      <PrefetchTranscripts urls={audioUrls} />

      <div className='min-h-screen max-w-md relative overflow-hidden'>
        <div className='absolute inset-0'>
          {flashcards.map((card) => (
            <div
              key={card.id}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${card.backgroundImage === currentBgImage
                ? "opacity-100"
                : "opacity-0"
                }`}
              style={{
                backgroundImage: `url("${card.backgroundImage || "/video-bg.png"
                  }")`,
              }}
            />
          ))}
        </div>

        <div className='z-10'>
          <div className='h-screen flex flex-col'>
            <Flashcards
              cards={flashcards}
              onComplete={handleComplete}
              onSlideChange={handleSlideChange}
              className='flex-1'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
