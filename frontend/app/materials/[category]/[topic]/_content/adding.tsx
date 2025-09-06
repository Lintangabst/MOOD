import Image from "next/image";
import MaterialExercise from "@/components/material-exercise";

export default function AddingContent() {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-green-700 font-bold text-xl mb-2">Penjelasan Materi</h2>
        <h3 className="text-green-600 font-semibold text-lg mb-4">Apa itu Penjumlahan?</h3>

        <Image
          src="/img/add1.png"
          alt="Ilustrasi penjumlahan"
          width={500}
          height={250}
          className="mb-4"
        />

        <p className="text-sm text-gray-800 mb-4">
          Penjumlahan adalah operasi matematika yang digunakan untuk menambahkan dua angka atau lebih
          untuk mendapatkan jumlah keseluruhan.
        </p>

        <h4 className="text-green-600 font-semibold text-sm mb-1">Cara mengerjakan Penjumlahan</h4>
        <p className="text-sm text-gray-700 mb-4">
          Penjumlahan dengan Cara Menghitung Ulang (Menghitung pada Jari): Kadang-kadang, jika kita belum bisa
          menghitung dalam kepala, kita bisa menggunakan tangan kita untuk membantu.
        </p>

        <h4 className="text-green-600 font-semibold text-sm mb-1">Contoh :</h4>
        <p className="text-sm text-gray-700">
          Kamu memiliki 3 apel, lalu temanmu memberi 2 apel lagi. Sekarang, berapa banyak apel yang kamu punya?
          <br />
          <strong>3 + 2 = 5.</strong> Jadi, kamu punya 5 apel sekarang!
        </p>
      </div>

<MaterialExercise topic="adding" />
    </div>
  );
}
