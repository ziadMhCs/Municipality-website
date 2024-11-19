import { FormEvent, ChangeEvent, useState } from 'react';
import instance from '../../api/instance'
import toast, { Toaster } from 'react-hot-toast';
import { PhotoIcon } from '@heroicons/react/24/solid'
import { IComplaints } from '@/interfaces';

export default function Form() {
    const [comData, setCompData] = useState<IComplaints>({
        name: "",
        number: "",
        description: "",
        photos: []
    })
    const [reader, setReader] = useState("")
    const changeHandler = async (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let numbers = /^[0-9]*$/;
        if (name == "number" && !value.match(numbers)) return null

        if (name == "photos") {
            const files: FileList | null = (e.target as HTMLInputElement).files;
            const filesArray = files ?? [];
            if (filesArray?.length > 0) {

                const newPhotos = Array.from(filesArray) as File[];
                setCompData((prev) => ({ ...prev, photos: newPhotos }));
                // const reader = new FileReader();
                // reader.onload = () => setReader(reader.result);
                // reader.readAsDataURL(files![0]);
            }
        } else {
            setCompData((prev) => ({ ...prev, [name]: value }));
        }
    }

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            let res = await instance.post('/complaint', comData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            (res.status === 200 || res.status === 201) ? toast.success('تم ارسال الشكوى بنجاح', {
                duration: 2000,
                position: 'top-center',
                className: 'bg-blue-100',
                icon: '👏',
            }) : null;
        } catch (error) {
            console.error('Error fetching news:', error);
            toast.error('حدث خطأ أثناء ارسال الشكوى', {
                duration: 2000,
                position: 'top-center',
                className: 'bg-red-100',
            });
        }
    };

    return (
        <form className='bg-[#F8F0E5] lg:w-5/12 p-3 rounded-xl' onSubmit={(e) => submitHandler(e)}>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="space-y-2">
                <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                        اسم مقدم الشكوى:<span className='text-red-900'>*</span>
                    </label>
                    <div className="flex rounded-md shadow-sm w-full">
                        <input
                            required
                            id="name"
                            name="name"
                            type="text"
                            placeholder="الاسم و الكنية"
                            autoComplete="name"
                            value={comData.name}
                            onChange={(e) => { changeHandler(e) }}
                            className="bg-white block flex-1 rounded-lg px-3 py-1.5 placeholder:text-gray-400 sm:text-sm w-full sm:leading-6"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label htmlFor="number" className="block text-sm font-medium leading-6 text-gray-900">
                        رقم التواصل:<span className='text-red-900'>*</span>
                    </label>
                    <div className="flex rounded-md shadow-sm w-full">
                        <input
                            required
                            id="number"
                            name="number"
                            type="text"
                            placeholder="هاتف ثابت أو موبايل"
                            autoComplete="number"
                            value={comData.number}
                            onChange={(e) => { changeHandler(e) }}
                            className="bg-white block flex-1 rounded-lg px-3 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full sm:leading-6"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                        مضمون الشكوى:<span className='text-red-900'>*</span>
                    </label>
                    <div>
                        <textarea
                            required
                            id="description"
                            name="description"
                            rows={2}
                            value={comData.description}
                            onChange={(e) => { changeHandler(e) }}
                            placeholder='شرح طبيعة الشكوى أو المخالفة ........'
                            className="block px-3 w-full rounded-md py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                        الصور المرفقة :
                    </label>
                    <div className="bg-white flex justify-center rounded-lg px-6 py-3">
                        {reader ? <div className='relative h-44'>
                            <img className='w-auto h-full' src={reader} alt='upload' /><span
                                onClick={() => setReader("")}
                                className='text-red-900 cursor-pointer font-semibold text-xl absolute right-2 top-0'>x</span>
                        </div> :
                            <div className="text-center">
                                <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                                <div className="items-center justify-center flex text-xs leading-6 text-gray-600">

                                    <label
                                        htmlFor="photos"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-gray-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                        <span>اضغط لإضافة صور أو اسحب الصور وافلت هنا</span>
                                        <input
                                            id="photos"
                                            name="photos"
                                            accept="image/*"
                                            type="file"
                                            onChange={(e) => { changeHandler(e) }}
                                            className="sr-only" />
                                    </label>
                                </div>
                                <p className="text-xs font-semibold leading-6 text-gray-600">يجب ألا يتجاوز حجم الصورة 2 ميغابايت وعدد الصور 1</p>
                            </div>
                        }

                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="w-full my-3 rounded-md bg-primary py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                إرسال الشكوى
            </button>
        </form>
    )
}
