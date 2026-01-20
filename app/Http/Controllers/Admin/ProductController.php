<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();
        // фильтр по наличию
        if ($request->has('available')) {
            $query->where('status', 'available');
        }
        $products = $query->orderByDesc('id')->paginate(30);
        return view('admin.products.index', compact('products'));
    }
    public function create()
    {
       $categories = Category::all();
        return view('admin.products.create', compact('categories'));
    }
    public function store(Request $request)
    {      
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'category_id' => ['required','integer'],
            'price'       => ['required', 'integer', 'min:0'],
            'quantity'    => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'status'      => ['required', 'in:available,unavailable,archived'],
            'image'       => ['nullable', 'image', 'max:4096'],
            'gallery'     => ['nullable', 'array'],     // ← ВАЖНО
            'gallery.*'   => ['nullable', 'image', 'max:4096'],
        ]);
     
        $data['slug'] = Str::slug($data['name']);       
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }
        $galleryPaths = [];
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $galleryPaths[] = $file->store('products/gallery', 'public');
            }
        }
        $data['gallery'] = $galleryPaths;
        Product::create($data);
        return redirect()->route('admin.products.index')->with('success', 'Товар создан');
    }
    public function edit(Product $product)
    {       
        $categories = Category::all();
        return view('admin.products.edit', compact('product', 'categories'));
    }
    public function show(Product $product)
    {
        return view('admin.products.show', compact('product'));
    }
    public function update(Request $request, Product $product)
    {             
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'category_id' => 'required|integer',
            'price'       => 'required|integer|min:0',
            'quantity'    => 'required|integer|min:0',
            'description' => 'nullable|string',
            'status'      => 'required|in:available,unavailable,archived',
            'image'       => 'nullable|image|max:4096', // это теперь файл
        ]);        
        // если выбрали НОВОЕ фото
        if ($request->hasFile('image')) {
            // при желании можно удалить старый файл
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            // сохраняем новое и кладём путь в $data
            $data['image'] = $request->file('image')
                ->store('products', 'public');
        } else {
            // файл не выбирали — оставляем старое значение в БД
            unset($data['image']);
        }
        $product->update($data);
        return redirect()
            ->route('admin.products.edit', $product)
            ->with('success', 'Изменения сохранены');
    }
    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('admin.products.index')
            ->with('success', 'Товар удалён');
    }
    public function uploadGallery(Request $request, Product $product)
    {
        $request->validate([
            'gallery.*' => ['image','max:4096']
        ]);
        $gallery = $product->gallery ?? [];
        foreach ($request->file('gallery', []) as $file) {
            $gallery[] = $file->store('products/gallery', 'public');
        }
        $product->gallery = $gallery;
        $product->save();

        return back()->with('success','Фото добавлены');
    }

    public function deleteGallery(Product $product, $index)
    {
        $gallery = $product->gallery;

        if (isset($gallery[$index])) {

            // удалить файл с диска (если нужно)
            Storage::disk('public')->delete($gallery[$index]);

            // удалить из массива
            unset($gallery[$index]);

            // переиндексация
            $product->gallery = array_values($gallery);

            $product->save();
        }

        return back()->with('success','Фото удалено');
    }

}
